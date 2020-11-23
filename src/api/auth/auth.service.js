const User = require("../user/user.model");
const jwt = require("../../utils/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../../utils/email");

module.exports = {
    /**
     * refreshtoken
     * revoketoken
     * forgotPassword
     * validateResetToken
     * validateResetToken
     * resetPassword
     */
    login,
    register,
    verifyEmail,
    create,
    update,
    getAll,
    getById,
    delete: _delete,
};

async function login({ email, password }) {
    const account = await getAccount({ email });

    if (
        !account ||
        !account.isVerified ||
        !(await bcrypt.compare(password, account.password))
    ) {
        throw "Email or password is incorrect";
    }

    const token = await jwt.sign(account);

    return {
        user: basicDetails(account),
        token,
    };
}

async function register(params, origin) {
    // validate
    if (await getAccount({ email: params.email })) {
        // send already registered error in email to prevent account enumeration
        // await sendAlreadyRegisteredEmail(params.email, origin);
        const error = new Error(
            'Email "' + params.email + '" is already registered'
        );

        throw error;
    }

    const account = await insertUser(params);

    // send email;
    // await sendVerificationEmail(account, origin);

    const token = await jwt.sign(account);

    return {
        user: account,
        token,
    };
}

async function verifyEmail({ token }) {
    const account = await getAccount({ verificationToken: token });

    if (!account) throw "Verification failed";

    await account.$query().patch({
        verified: Date.now(),
        isVerified: true,
        verificationToken: null,
    });
}

async function create(params) {
    // validate
    if (await getAccount({ email: params.email })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = await insertUser(params);

    return basicDetails(account);
}

async function update(id, params) {
    const account = await getAccount({ id });

    // validate if email was changed
    if (
        params.email &&
        account.email !== params.email &&
        (await getAccount({ email: params.email }))
    ) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.password = await hash(params.password);
    }

    const updatedUser = await User.query().patchAndFetchById(id, { ...params });

    return basicDetails(updatedUser);
}

// TODO MAKE SO IT CAN QUERY FOR DIFFERENT TYPES OF USERS
async function getAll() {
    const accounts = await User.query();
    return accounts.map((x) => basicDetails(x));
}

async function getById(id) {
    const account = await getAccount({ id });
    return basicDetails(account);
}

// TODO MAKE IT ACCEPT AN ARRAY OF ID
async function _delete(id) {
    await User.query().deleteById(id);
}

/**==================== Helpers ====================== */
async function getAccount(param) {
    const account = await User.query()
        .where({ ...param })
        .first();
    return account;
}

async function insertUser(params) {
    const { firstName, lastName, email, password, role, phoneNumber } = params;

    // hash password and verification token
    const hashedPassword = await hash(password, 10);
    const verificationToken = randomTokenString();

    // create account
    const account = await User.query().insert({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        phoneNumber,
        role: role,
        active: true,
        isVerified: false,
        verified: new Date().toISOString(),
        verificationToken,
    });

    return basicDetails(account);
}

async function hash(password) {
    return await bcrypt.hash(password, 10);
}

function randomTokenString() {
    return crypto.randomBytes(40).toString("hex");
}

function basicDetails(account) {
    const {
        id,
        firstName,
        lastName,
        email,
        role,
        created,
        updated,
        isVerified,
    } = account;
    return {
        id,
        firstName,
        lastName,
        email,
        role,
        created,
        updated,
        isVerified,
    };
}

async function sendVerificationEmail(account, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/auth/verify-email?token=${account.verificationToken}`;
        message = `<p> Please click the below link to verify your email address:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        `;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/auth/verify-email</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: "Sign-up verification API - Verify Email",
        html: `<h4>Verify Email</h4>
        <p>Thanks for registering!</p>
        ${message}`,
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/auth/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/auth/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: "Sign-up Verification API - Email Already Registered",
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`,
    });
}

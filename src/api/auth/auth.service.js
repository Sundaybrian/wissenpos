const User = require("../user/user.model");
const jwt = require("../../utils/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendEmail } = require("../../utils/email");

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
    const account = await User.query().where({ email }).first();

    if (
        !account ||
        !account.isVerified ||
        !(await bcrypt.compare(password, account.password))
    ) {
        throw "Email or password is incorrect";
    }

    const token = await jwt.sign(account);

    return {
        ...basicDetails(account),
        token,
    };
}

async function register(params, origin) {
    // validate
    if (await User.query().where({ email: params.email })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    const { firstName, lastName, email, password, role } = params;

    // hash password and verification token
    const hashedPassword = await hash(password, 10);
    const verificationToken = randomTokenString();

    // create account
    const account = await User.query().insert({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: role,
        active: true,
        isVerified: true,
        verificationToken,
    });

    // send email;
    await sendVerificationEmail(account, origin);

    const token = await jwt.sign(account);

    return {
        ...basicDetails(account),
        token,
    };
}

async function verifyEmail({ token }) {
    const account = await User.query().where({ verificationToken: token });

    if (!account) throw "Verification failed";

    await account.$query().patch({
        verified: Date.now(),
        isVerified: true,
        verificationToken: null,
    });
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
        title,
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
        title,
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

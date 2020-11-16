const User = require("../user/user.model");
const jwt = require("../../utils/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
    getAll,
    getById,
    create,
    update,
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

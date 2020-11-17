const jwt = require("jsonwebtoken");
const User = require("../api/user/user.model");

module.exports = {
    auth,
};

async function auth(req, res, next) {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split("Bearer ")[1];
    } else {
        return res.status(403).json({
            message: "Token not found, access denied",
        });
    }

    //verify token and account
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.query().where({ id: decodedToken.id }).first();

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        next(error);
    }
}

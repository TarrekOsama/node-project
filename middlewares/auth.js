const jwt = require("jsonwebtoken");
const util = require("util");
const APIError = require("./../util/APIError");
const User = require("./../models/users");

const jwtVerify = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw new APIError("No token provided", 401);

        const { userId } = await jwtVerify(token, process.env.JWT_SECRET);
        const user = await User.findById(userId).select("_id name email role");
        if (!user) throw new APIError("User not found", 404);

        req.user = user;
        next();
    } catch (err) {
        next(err instanceof APIError ? err : new APIError("Invalid or expired token", 401));
    }
};

module.exports = auth;
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
    const token = req.header('Authorization')?.split(" ")[1];
    if (!token) {
        console.log("No token provided in Authorization header");
        return res.status(401).json({ message: "Access Denied. No Token." });
    }

    try {
        console.log("Verifying token:", token);
        console.log("Using JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Token verified successfully:", verified);
        req.user = verified;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(400).json({ message: "Invalid Token" });
    }
};
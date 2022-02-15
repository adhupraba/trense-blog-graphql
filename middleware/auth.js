const jwt = require("jsonwebtoken");
const { env } = require("../utils/env");
const { AuthenticationError } = require("apollo-server-express");

const auth = (context) => {
    const authHeader = context.req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, env.jwtSecret);
                return decoded;
            } catch (err) {
                throw new AuthenticationError("Invalid/Expired token.");
            }
        }
        throw new Error("Authentication token is not available.");
    }
    throw new Error("Authorization header must be provided.");
};

module.exports = auth;

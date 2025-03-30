const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing"})
    } 
    try {
        const validToken = verify(accessToken, JWT_SECRET_KEY)
        if (validToken) {
            req.authenticated = true
            req.user = validToken
            return next()
        }
    } catch(error) {
        return res.status(403).json({ message: "Invalid access token"})
    }
};

module.exports = {
    verifyToken
}
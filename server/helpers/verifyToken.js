const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.access_token;
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing"})
    } 
    try {
        console.log("validating token..")
        const validToken = jwt.verify(accessToken, secretKey)
        console.log(validToken)
        if (validToken) {
            req.authenticated = true
            req.user = validToken
            return next()
        }
    } catch(error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }    
        return res.status(403).json({ message: "Invalid access token"})
    }
};

module.exports = {
    verifyToken
}
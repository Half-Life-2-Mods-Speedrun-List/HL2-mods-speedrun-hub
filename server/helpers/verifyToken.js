const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    // token comes either from authorization herader or from cookies
    let accessToken = req.cookies.access_token;
    const secretKey = process.env.JWT_SECRET_KEY;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
    }

    if (!accessToken) {
        console.log("error")
        return res.status(401).json({ message: "Access token is missing"})
    } 
    try {
        console.log("validating token..")
        const validToken = jwt.verify(accessToken, secretKey)
        
        if (validToken) {
            req.authenticated = true
            req.user = validToken
            return next()
        }
    } catch(error) {
        console.log("error")
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }    
        return res.status(403).json({ message: "Invalid access token"})
    }
};

module.exports = {
    verifyToken
}
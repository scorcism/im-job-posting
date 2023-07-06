const jwt = require('jsonwebtoken')
const JWT_SECRET = "abhishekpathak"

const fetchUser = (req, res, next) => {
    const token = req.header("auth-token");
    // // console.log(token)
    if (!token) {
        res.status(401).json({ status: 0, message: "Authenticate using valid token" })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).json({ status: 0, message: "Authenticate using valid token" });
    }
}

module.exports = fetchUser;
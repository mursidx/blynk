const jwt = require("jsonwebtoken");
require("dotenv").config();


async function validateAdmin(req, res, next) {
    try {
        let token = req.cookies.token;
        if (!token) return res.send("need to login first");
        let data = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next()
    } catch (error) {
        res.send(error.message)
    }
}


module.exports = validateAdmin;
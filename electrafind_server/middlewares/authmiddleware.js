const jwt = require('jsonwebtoken');
const {user} = require('../models');

const userProtect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // console.log('Token: ', token);

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded: ', decoded);
        req.user = await user.findOne({where: {UserID: decoded.userId}});
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = userProtect; // Ensure this is a valid export

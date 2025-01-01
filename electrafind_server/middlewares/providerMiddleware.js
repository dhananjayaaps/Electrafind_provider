const jwt = require('jsonwebtoken');
const {chargingStation} = require('../models');

const providerProtect = async (req, res, next) => {
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
        req.provider = await chargingStation.findOne({where: {StationID: decoded.id}});
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = providerProtect; // Ensure this is a valid export

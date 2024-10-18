const jwt = require('jsonwebtoken');

const sequelize = require('../config/db');
const initModels = require('../models/init-models');
const models = initModels(sequelize);

const authMiddleware = async(req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await models.users.findOne({
            where: { userid: decoded.userid },
            attributes: ['userid', 'role']
        });
        if (!user) return res.status(401).json({ message: "Invalid token1" });

        req.user = user; // Lưu thông tin id và role vào req
        next();
    } catch (error) {
        console.error("Token verification error:", error); 
        res.status(401).json({ message: "Invalid token2" });
    }
};

module.exports = authMiddleware;

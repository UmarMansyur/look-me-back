const jwt = require('jsonwebtoken');

const generateToken = (payload, type) => {
    const env = type === 'access' ? process.env.JWT_SECRET_ACCESS : process.env.JWT_SECRET_REFRESH;
    return jwt.sign(payload,env, { expiresIn: type === 'access' ? '10m' : '1d' });
}

const verifyToken = (token, type) => {
    const env = type === 'access' ? process.env.JWT_SECRET_ACCESS : process.env.JWT_SECRET_REFRESH;
    return jwt.verify(token,env);
}

const decodeToken = (token, type) => {
    const env = type === 'access' ? process.env.JWT_SECRET_ACCESS : process.env.JWT_SECRET_REFRESH;
    return jwt.decode(token,env);
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};
const jwt = require('jsonwebtoken');

const generateToken = (payload, type) => {
    const env = type === 'access' ? process.env.ACCESS_TOKEN : process.env.REFRESH_TOKEN;
    return jwt.sign(payload,env, { expiresIn: type === 'access' ? '15m' : '1d' });
}

const verifyToken = (token, type) => {
    const env = type === 'access' ? process.env.ACCESS_TOKEN : process.env.REFRESH_TOKEN;
    return jwt.verify(token,env);
}

const decodeToken = (token, type) => {
    const env = type === 'access' ? process.env.ACCESS_TOKEN : process.env.REFRESH_TOKEN;
    return jwt.decode(token,env);
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};
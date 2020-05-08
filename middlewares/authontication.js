const User = require('../models/User')
const customError = require('../helpers/customError');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) throw customError(401, 'No Authorization provided');
    const currentUser = await User.getUserFromToken(token)
    req.user = currentUser
    next();
}
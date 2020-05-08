const Product = require('../models/Product')
const customError = require('../helpers/customError');
module.exports = async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.user.id;
    const product = await Product.findById(productId);
    if (!product.userId.equals(userId)) {
        throw customError(403, 'Not Authorized');
    }
    next()

}
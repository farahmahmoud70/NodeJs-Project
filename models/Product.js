const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');


const productSchema = mongoose.Schema({

    userId: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    productName: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 100
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: false
    },
    // images: {
    //     data: Buffer,
    //     contentType: String
    // },
    tags: {
        type: [String],
        required: false,
        maxLength: 10
    },
    image: {
        type: String
    }
}, {
    timestamps: true,
})

productSchema.set('toJSON', {
    virtuals: true,
    transform: (doc) => {
        return _.pick(doc, ["id", "userId", "productName", "description", "categoryId", "price", "discount", "picture", "tags", "category", "user"])
    }
});


// productSchema.virtual('user', {
//     ref: "User",
//     localField: "userId",
//     foreignField: "_id"
// })

productSchema.virtual('category', {
    ref: "Category",
    localField: "categoryId",
    foreignField: "_id"
})




const Product = mongoose.model('Product', productSchema)
module.exports = Product;
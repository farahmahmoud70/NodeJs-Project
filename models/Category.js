const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');


const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

categorySchema.set('toJSON', {
    virtuals: true,
    transform: (doc) => {
        return _.pick(doc, ["id", "categoryName"])
    }
});


const Category = mongoose.model('Category', categorySchema)
module.exports = Category;
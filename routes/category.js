const express = require('express');
const Category = require('../models/Category')
const router = express.Router();


router.get('', async (req, res, next) => {
    const categories = await Category.find().exec();
    res.send(categories);

})


router.get('/:id', async (req, res, next) => {
    const {
        id
    } = req.params;
    const category = await Category.findById(id)
    res.json({
        category
    })

})

router.post('',
    async (req, res, next) => {

        const {
            categoryName
        } = req.body;

        const category = new Category({

            categoryName,

        })

        await category.save();
        res.json(category);

    })




module.exports = router;
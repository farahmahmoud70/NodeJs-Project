const express = require('express');
const Product = require('../models/Product')
const authonticationMiddleware = require('../middlewares/authontication')
const ownerAuthorization = require('../middlewares/ownerAuthorization')
//const querystring = require('querystring');

const router = express.Router();
const multer = require('multer');


const {
    v4: uuidv4
} = require('uuid');
//const uuidv4 = require('uuid/v4');


router.get('', async (req, res, next) => {
    const {
        categoryKey = "0", page = 1, limit = 9
    } = req.query;
    let start = (page - 1) * limit
    let end = start + limit
    let searchKey = req.query.searchKey ? req.query.searchKey : "";
    let sortKey = req.query.sortKey ? req.query.sortKey : "";
    let products
    let count
    if (categoryKey == "0" && searchKey === "") {
        products = await Product.find().populate('category');

    } else if (searchKey && categoryKey == "0") {
        products = await Product.find({
            productName: {
                $regex: new RegExp(".*" + searchKey.toLowerCase() + ".*")
            }
        }).populate('category');
    } else if (categoryKey && searchKey == "") {
        products = await Product.find({
            categoryId: categoryKey
        }).populate('category');
    } else if (categoryKey != "0" && searchKey) {
        products = await Product.find({
            $and: [{
                    categoryId: categoryKey
                },
                {
                    productName: {
                        $regex: new RegExp(".*" + searchKey.toLowerCase() + ".*")
                    }
                }
            ]
        }).populate("category");
    }
    if (sortKey === "name") {
        products = products.sort((a, b) => (a.productName > b.productName) ? 1 : -1)
    } else if (sortKey === "lowPrice") {
        products = products.sort((a, b) => (a.price > b.price) ? 1 : -1)
    } else if (sortKey === "highPrice") {
        products = products.sort((a, b) => (a.price > b.price) ? -1 : 1)
    }
    count = products.length;
    products = count > limit ? products.slice(start, end) : products;
    // if (count > limit) {
    //     products = products.slice(start, end)
    // }

    res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    });
})


router.get('/:id', async (req, res, next) => {
    const {
        id
    } = req.params;
    const product = await Product.findById(id).populate("category")
    res.json({
        product
    })
})


router.get('/searchKey/:word', async (req, res, next) => {
    const {
        word
    } = req.params;
    const products = await Product.find().exec();
    const searchResult = products.filter(product => product.productName.toLowerCase().includes(word.toLowerCase()))
    res.send(searchResult);
})




const DIR = 'uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});





router.post('', authonticationMiddleware,
    // upload.single('image'),
    async (req, res, next) => {
       /// const url = req.protocol + '://' + req.get('host')
        const {

            productName,
            categoryId,
            price,
            discount,
            description,
            tags,
        } = req.body;

        const product = new Product({
            userId: req.user.id,
            productName,
            categoryId,
            price,
            discount,
            description,
            //image: url + '/assets/' + req.file.filename,
            tags
        })
        await product.save();
        res.json({
            product,
            //image: result.image
        });

    })




router.patch('/:id', authonticationMiddleware, ownerAuthorization, async (req, res, next) => {

    const {
        id
    } = req.params;
    const {
        productName,
        categoryId,
        price,
        discount,
        picture,
        tags
    } = req.body;
    const product = await Product.findByIdAndUpdate(id, {
        $set: {
            productName,
            categoryId,
            price,
            discount,
            picture,
            tags
        }
    }, {
        omitUndefined: true,
        new: true,
        runValidators: true
    })

    res.status(200).json({
        message: "product was edited successfully",
        product
    })


})

router.delete('/:id', authonticationMiddleware, ownerAuthorization, async (req, res, next) => {

    const {
        id
    } = req.params;
    await Product.findByIdAndDelete(id)
    res.status(200).json({
        message: "product was deleted"
    })
})








module.exports = router;
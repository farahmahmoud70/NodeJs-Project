const express = require('express');
const User = require('../models/User')
const authonticationMiddleware = require('../middlewares/authontication')
const validationMiddleware = require('../middlewares/validation')
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');

router.get('', async (req, res, next) => {
    const users = await User.find().exec();
    const userNames = users.map(u => u.username)
    res.send(userNames);

})



router.post('/register',
    validationMiddleware(
        check("username").custom((value) => {
            return User.findOne({ username: value }).then((user) => {
              if (user) {
                return Promise.reject("username already in use");
              }
            });
          }),
          check("email").custom((value) => {
            return User.findOne({ email: value }).then((user) => {
              if (user) {
                return Promise.reject("email already in use");
              }
            });
          }),


        check('password').isLength({
            min: 8
        }).withMessage('must be atleast 8 chars long').matches(/\d/).withMessage('must contain a number'),


        check('firstName').isString().isLength({
            min: 3,
            max: 10
        }).withMessage('must be atleast 3 chars long'),
        check('lastName').isString().isLength({
            min: 3,
            max: 10
        }).withMessage('must be atleast 3 chars long'),
        check('username').isString().withMessage('the username must be a string'),
        check('email').isEmail().withMessage('must be an email address'),


        // check("password").custom((value, {
        //     req
        // }) => {
        //     if (value !== req.body.reEnteredPassword) {
        //         throw new Error("Password confirmation is incorrect");
        //     }
        // })

    ),
    async (req, res, next) => {
        const {
            email,
            username,
            password,
            firstName,
            lastName
        } = req.body;

        const user = new User({
            email,
            username,
            password,
            firstName,
            lastName
        })

        await user.save();
        res.json({
            message: "user was registered successfully",
            user,
        });
    })



router.post('/login', async (req, res, next) => {


    const {
        email,
        username,
        password
    } = req.body
    // const user = await User.findOne({
    //     username,
    //     password
    // }).populate('posts');
    let userData = username != null ? {
        username: username
    } : {
        email: email
    }
    console.log(userData)
    const user = await User.findOne(
        userData
    )
    // .populate('products');
    if (!user) throw new Error("wrong username/email or password");
    const isValidUser = await user.comparePassword(password);
    const token = await user.generateToken();
    if (!isValidUser) throw new Error("wrong user namename or password");
    const currentUser = user.currentUser
    user ?
        res.json({
            message: "logged in successfully",
            user,
            token
        }) :
        res.status(401).json({
            error: "invalid credentials"
        });

})
// router.get('/profile', authonticationMiddleware, (req, res, next) => {

//     const {
//         authorization
//     } = req.headers;

//     res.json({
//         message: 'this is your profile'
//     });
// })


router.patch('/:id', authonticationMiddleware, async (req, res, next) => {

    const {
        id
    } = req.params;
    const {
        email,
        username,
        password,
        firstName,
        lastName
    } = req.body;
    const user = await User.findByIdAndUpdate(id, {
        $set: {
            email,
            username,
            password,
            firstName,
            lastName
        }
    }, {
        omitUndefined: true,
        new: true,
        runValidators: true
    })
    console.log(user)
    res.status(200).json({
        message: "user was edited successfully",
        user
    })
})

router.delete('/:id', authonticationMiddleware, async (req, res, next) => {

    const {
        id
    } = req.params;
    const user = await User.findByIdAndDelete(id)
    res.status(200).json({
        message: "user was deleted"
    })

})

module.exports = router;
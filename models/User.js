const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const validator = require('validator');
var fs = require('fs');


const saltRounds = 7;
const jwtSecret = process.env.JWT_SECRET;

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

const userSchema = mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (v) => {
      return validator.isEmail(v);
    }
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    minLength: 3,
    maxLength: 10,
    required: true
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength: 10,
    required: true
  },
  // img: {
  //   data: Buffer,
  //   contentType: String
  // }
}, {
  timestamps: true,
})


userSchema.set('toJSON', {
  //getters: trure,
  virtuals: true,
  transform: (doc) => {

    return _.pick(doc, ['id', 'username', 'firstName', 'lastName'])
    // return ({
    //     id: doc.id,
    //     username: doc.username,
    //     password: doc.password,
    //     firstName: doc.firstName,
    //     age: doc.age,
    //     posts: doc.posts
    // })
  }
})

userSchema.pre('save', async function () {
  const userInstance = this;
  if (this.isModified('password')) {
    userInstance.password = await bcrypt.hash(userInstance.password, saltRounds)
  }

});

userSchema.methods.comparePassword = function (plainPassword) {
  const userInstance = this;
  return bcrypt.compare(plainPassword, userInstance.password);
};

// userSchema.virtual('posts', {
//     ref: "Post",
//     localField: "_id",
//     foreignField: "userId"
// })




userSchema.methods.generateToken = function () {
  const userInstance = this;
  return sign({
    userId: userInstance.id
  }, jwtSecret, {
    // expiresIn
  })
}

userSchema.statics.getUserFromToken = async function (token) {
  const User = this;
  const payload = await verify(token, jwtSecret)
  const currentuser = await User.findById(payload.userId);
  if (!currentuser) throw new Error('User not found')
  return currentuser
}

// await jwt.sign({
//     userId: '123'
// }, 'thisIsSecret', {
//     expiresIn: "30m"
// })

// await jwt.verify('token', 'thisIsMySecret')

const User = mongoose.model('User', userSchema)
module.exports = User;
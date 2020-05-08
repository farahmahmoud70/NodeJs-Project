let multer = require('multer'),
    uuidv4 = require('uuid/v4'),

    const DIR = '../assets/';

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
















































// const multer = require('multer');
// var upload = multer({
//     dest: 'uploads/'
// });
// module.exports = async (req, res, next) => {

//     var imageName;

//     var uploadStorage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, './uploads');
//         },
//         filename: function (req, file, cb) {
//             imageName = file.originalname;
//             //imageName += "_randomstring"
//             cb(null, imageName);
//         }
//     });

//     var uploader = multer({
//         storage: uploadStorage
//     });

//     var uploadFile = upload.single('image');
//     // upload.array('profiles', 4)

//     uploadFile(req, res, function (err) {
//         req.imageName = imageName;
//         req.uploadError = err;
//         next();
//     })
// }
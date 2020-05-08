const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.info("connected");
}).catch((err) => {
    console.error(err)
    process.exit(1);
});

module.exports = mongoose
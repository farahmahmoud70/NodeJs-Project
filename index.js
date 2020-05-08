express = require('express')
require('dotenv').config()
require('./dataBase/db');
require('express-async-errors')
const cors = require('cors')
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category')

const port = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use('/uploads', express.static('uploads'));
app.use("/user", userRouter)
app.use("/products", productRouter)
app.use("/category", categoryRouter)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (statusCode >= 500) {
        console.log(err)
        return res.status(statusCode).json({
            message: err.message,
            type: "INTERNAL_SERVER_ERROR",
            details: []
        })
    }
    res.status(statusCode).json({
        message: err.message,
        type: err.type,
        details: err.details
    })


})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
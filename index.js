require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const connectDB = require('./db/connect')
const app = express()

const studentRouter = require('./routes/student')
const teacherRouter = require('./routes/teacher')

// middlewares
app.use(bodyParser.json())

// routes
app.use('/student', studentRouter)
app.use('/teacher', teacherRouter)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(process.env.PORT || 3000, () => console.log(`Server is listening on port ${process.env.PORT || 3000}...`))
    } catch (error) {
        console.log(error)
    }
}
start()
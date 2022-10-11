const Student = require('../models/student')
const Teacher = require('../models/teacher')
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    try {
        const student = await Student.findOne({email: req.body.email})
        if(student != null) {
            return res.status(StatusCodes.CONFLICT).json({
                message: 'Student with this email already exists'
            })
        }

        const studentDetails = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: await hash(req.body.password)
        }
        await Student.create(studentDetails)

        return res.status(StatusCodes.CREATED).json({
            message: 'Student signed up successfully'
        })
    } catch(e) {
        console.log(e)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error'
        })
    }
}

const login = async (req, res) => {
    if(req.body.email == null || req.body.password == null) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Need email address and password for login'
        })
    }

    const student = await Student.findOne({ email: req.body.email })
    if(student == null) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: 'User not found with given email address'
        })
    }

    if(!await compare(req.body.password, student.password)) {
        // incorrect password
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Invalid password'
        })
    }

    // generate a token and send
    const token = generateToken(student)
    return res.status(StatusCodes.OK).json({ token })
}

const auth = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Authentication invalid'
        })
    }
    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attach the student id to student routes
        req.studentId = payload.id
        return next()
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Authentication invalid'
        })
    }
}

const getFavTeacher = async (req, res) => {
    const student = await Student.findById(req.studentId)
    const favTeacherID = student.favTeacher
    
    if (favTeacherID == null) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: 'This student does not have a favorite teacher'
        })
    }

    const teacher = await Teacher.findById(favTeacherID).select('-__v')
    return res.status(StatusCodes.OK).json(teacher)
}

const setFavTeacher = async (req, res) => {
    const teacher = await Teacher.findById(req.body.teacherId)
    if(teacher == null) {
        return res.status(StatusCodes.CONFLICT).json({
            message: 'Teacher with given ID does not exist'
        })
    }
    console.log('setting fav teacher: ' + req.body.teacherId)
    console.log(await Student.findByIdAndUpdate(req.studentId, { $set: { favTeacher: req.body.teacherId } }, { upsert: true }).exec())
    return res.status(StatusCodes.OK).json({
        message: 'Favorite teacher set'
    })
}

const deleteFavTeacher = async (req, res) => {
    const student = await Student.findById(req.studentId)
    if(student.favTeacher == null) {
        return res.status(StatusCodes.CONFLICT).json({
            message: 'Student does not have a favorite teacher'
        })
    }
    
    await student.update({ $unset: { favTeacher: 1 } }).exec()
    return res.status(StatusCodes.OK).json({
        message: 'Removed favorite teacher'
    })
}

async function hash(plainPassword) {
    if(plainPassword == null) {
        throw new Error('Password field not provided')
    }
    return await bcrypt.hash(plainPassword, 10)
}

async function compare(plainPassword, hash) {
    return await bcrypt.compare(plainPassword, hash)
}

function generateToken(student) {
    return jwt.sign({
        id: student._id
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY })
}

module.exports = {
    signup, login, auth, getFavTeacher, setFavTeacher, deleteFavTeacher
}
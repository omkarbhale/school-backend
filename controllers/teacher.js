const Teacher = require('../models/teacher')
const Student = require('../models/student')
const { StatusCodes } = require('http-status-codes')

const getAllTeachers = async (req, res) => {
    const teachers = await Teacher.find({}).select('-__v')
    res.status(StatusCodes.OK).json(teachers)
}

const getPopularity = async (req, res) => {
    const result = await Student.aggregate([
        { $match: {} },
        { $group: { _id: "$favTeacher", count: { $sum: 1 } } },
        { $sort: { count: 1 } }
    ]).limit(10).exec()
    // console.log(result)
    return res.status(StatusCodes.OK).json(result)
}

module.exports = {
    getAllTeachers, getPopularity
}
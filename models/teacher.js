const mongoose = require('mongoose')

const TeacherSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            '{VALUE} must be an email'
        ],
        unique: true
    },
    phone: {
        type: String,
        required: true,
        validate: [
            /^[789]\d{9}$/,
            '{VALUE} must be a phone number'
        ]
    }
})

module.exports = mongoose.model('Teacher', TeacherSchema)
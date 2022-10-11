const express = require('express')
const router = express.Router()

const { getAllTeachers, getPopularity } = require('../controllers/teacher')

router.get('/', getAllTeachers)
router.get('/popularity', getPopularity)

module.exports = router
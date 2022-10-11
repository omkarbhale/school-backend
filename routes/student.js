const express = require('express')
const router = express.Router()

const { login, signup, auth, getFavTeacher, setFavTeacher, deleteFavTeacher } = require('../controllers/student')

router.post('/login', login)
router.post('/signup', signup)

router.post('/favteacher', auth, setFavTeacher) // to set/update fav teacher
router.get('/favteacher', auth, getFavTeacher) // to get current fac teacher
router.delete('/favteacher', auth, deleteFavTeacher) // to remove fav teacher

module.exports = router
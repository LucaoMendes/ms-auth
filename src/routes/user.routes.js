const express = require('express')
const UserController = require('../controller/UserController')
const router = express.Router()



router.post('/users',UserController.store)
router.post('/users/auth',UserController.auth)
router.get('/users',UserController.index)
router.get('/users/:uid',UserController.fromIndex)


module.exports = router
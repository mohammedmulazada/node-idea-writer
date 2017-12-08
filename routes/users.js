const express = require('express'),
	{
		Idea,
	} = require('../models/Idea'),
	mongoose = require('mongoose'),
	router = express.Router()


router.get('/login', (req, res) => {
	res.render('users/login')
})

router.get('/register', (req, res) => {
	res.send('register')
})

module.exports = router
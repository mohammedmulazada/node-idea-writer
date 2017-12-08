const {Strategy} = require('passport-local'),
	mongoose = require('mongoose'),
	bcrypt = require('bcryptjs'),
	{User} = require('../models/User')

module.exports = function (passport) {
	passport.use(new Strategy({
		usernameField: 'email',
	}, (email, password, done) => {
		User.findOne({
			email,
		}).then((user) => {
			if (!user) {
				return done(null, false, {
					message: 'No user found',
				})
			}

			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) throw err
				if (isMatch) {
					return done(null, user)
				}
				return done(null, false, {
					message: 'Password Incorrect',
				})

			})
		})
	}))


	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user)
		})
	})
}
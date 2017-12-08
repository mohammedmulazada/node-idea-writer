const mongoose = require('mongoose'),
	{Schema} = mongoose,
	UserSchema = new Schema({
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	}),
	User = mongoose.model('users', UserSchema)

module.exports = {User}
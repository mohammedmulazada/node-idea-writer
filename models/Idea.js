const mongoose = require('mongoose'),
	{Schema} = mongoose,
	IdeaSchema = new Schema({
		title: {
			type: String,
			required: true,
		},
		details: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	}),
	Idea = mongoose.model('Idea', IdeaSchema)

module.exports = {Idea}
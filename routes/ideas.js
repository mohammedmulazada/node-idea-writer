const express = require('express'),
	{
		Idea
	} = require('../models/Idea'),
	mongoose = require('mongoose'),
	router = express.Router()

router.get('/add', (req, res) => {
	res.render('ideas/add')
})

router.get('/edit/:id', (req, res) => {
	Idea.findOne({
			_id: req.params.id
		})
		.then((idea) => {
			res.render('ideas/edit', {
				idea,
			})
		})

})

router.post('/', (req, res) => {
	const errors = []

	if (!req.body.title) {
		errors.push({
			text: 'Please add a title'
		})
	}
	if (!req.body.details) {
		errors.push({
			text: 'Please add some details'
		})
	}
	if (errors.length > 0) {
		res.render('ideas/add', {
			errors,
			title: req.body.title,
			details: req.body.details,
		})
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details,
		}
		new Idea(newUser)
			.save()
			.then((idea) => {
				req.flash('success_msg', 'Idea added')
				res.redirect('/ideas')
			})
	}
})

router.get('/', (req, res) => {
	Idea.find({})
		.sort({
			date: 'desc'
		})
		.then((ideas) => {
			res.render('ideas/index', {
				ideas,
			})
		})

})

router.put('/:id', (req, res) => {
	Idea.findOne({
			_id: req.params.id,
		})
		.then((idea) => {
			idea.title = req.body.title,
				idea.details = req.body.details

			idea.save()
				.then((idea) => {
					req.flash('success_msg', 'Idea was updated')
					res.redirect('/ideas')
				})
		})
})

router.delete('/:id', (req, res) => {
	Idea.remove({
			_id: req.params.id
		})
		.then(() => {
			req.flash('success_msg', 'Idea removed')
			res.redirect('/ideas')
		})
})

module.exports = router
const express = require('express'),
	{
		Idea,
	} = require('../models/Idea'),
	mongoose = require('mongoose'),
	{
		ensureAuthenticated
	} = require('../helpers/auth')
router = express.Router()

router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('ideas/add')
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
			_id: req.params.id,
		})
		.then((idea) => {
			if (idea.user !== req.user.id) {
				req.flash('error_msg', 'Not authorized')
				res.redirect('/ideas')
			} else {
				res.render('ideas/edit', {
					idea,
				})
			}
		}).catch((err) => {
			req.flash('error_msg', 'Idea not found')
			res.redirect('/ideas')
		})
})

router.post('/', ensureAuthenticated, (req, res) => {
	const errors = []

	if (!req.body.title) {
		errors.push({
			text: 'Please add a title',
		})
	}
	if (!req.body.details) {
		errors.push({
			text: 'Please add some details',
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
			user: req.user.id,
		}
		new Idea(newUser)
			.save()
			.then((idea) => {
				req.flash('success_msg', 'Idea added')
				res.redirect('/ideas')
			})
	}
})

router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({
			user: req.user.id
		})
		.sort({
			date: 'desc',
		})
		.then((ideas) => {
			res.render('ideas/index', {
				ideas,
			})
		})

})

router.put('/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
			_id: req.params.id,
		})
		.then((idea) => {
			idea.title = req.body.title
			idea.details = req.body.details

			idea.save()
				.then((idea) => {
					req.flash('success_msg', 'Idea was updated')
					res.redirect('/ideas')
				})
		})
})

router.delete('/:id', ensureAuthenticated, (req, res) => {
	Idea.remove({
			_id: req.params.id,
		})
		.then(() => {
			req.flash('success_msg', 'Idea removed')
			res.redirect('/ideas')
		})
})

module.exports = router
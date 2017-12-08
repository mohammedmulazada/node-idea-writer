const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	exphbs = require('express-handlebars'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	session = require('express-session'),
	mongoose = require('mongoose'),
	{Idea} = require('./models/Idea'),
	port = 5000

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/ideawriter', {
	useMongoClient: true,
})
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err))

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(methodOverride('_method'))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}))

app.use(flash())

app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.error = req.flash('error')
	next()
})

app.get('/', (req, res) => {
	const title = 'Welcome'
	res.render('index', {
		title,
	})
})

app.get('/ideas/add', (req, res) => {
	res.render('ideas/add')
})

app.get('/ideas/edit/:id', (req, res) => {
	Idea.findOne({_id: req.params.id} )
		.then((idea) => {
			res.render('ideas/edit', {
				idea,
			})
		})

})

app.post('/ideas', (req, res) => {
	const errors = []

	if (!req.body.title) {
		errors.push({text: 'Please add a title'})
	}
	if (!req.body.details) {
		errors.push({text: 'Please add some details'})
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
				res.redirect('/ideas')
			})
	}
})

app.get('/about', (req, res) => {
	res.render('about')
})

app.get('/ideas', (req, res) => {
	Idea.find({})
		.sort({date: 'desc'})
		.then((ideas) => {
			res.render('ideas/index', {
				ideas,
			})
		})

})

app.put('/ideas/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id,
	})
		.then((idea) => {
			idea.title = req.body.title,
			idea.details = req.body.details

			idea.save()
				.then((idea) => {
					res.redirect('/ideas')
				})
		})
})

app.delete('/ideas/:id', (req, res) => {
	Idea.remove({_id: req.params.id})
		.then(() => {
			req.flash('success_msg', 'Idea removed')
			res.redirect('/ideas')
		})
})

app.listen(port, () => {
	console.log(`Server is online at Port ${port}.`)
})
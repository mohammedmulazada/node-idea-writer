const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	exphbs = require('express-handlebars'),
	mongoose = require('mongoose'),
	{IdeaSchema} = require('./models/Idea'),
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

app.get('/', (req, res) => {
	const title = 'Welcome'
	res.render('index', {
		title,
	})
})

app.get('/ideas/add', (req, res) => {
	res.render('ideas/add')
})

app.post('/ideas', (req, res) => {
	let errors = []

	if (!req.body.title) {
		errors.push({text:'Please add a title'})
	}
	if (!req.body.details) {
		errors.push({text:'Please add some details'})
	}
	if (errors.length > 0) {
		res.render('ideas/add', {
			errors,
			title: req.body.title,
			details: req.body.details
		})
	} else {
		res.send('passed')
	}
})

app.get('/about', (req, res) => {
	res.render('about')
})

app.listen(port, () => {
	console.log(`Server is online at Port ${port}.`)
})
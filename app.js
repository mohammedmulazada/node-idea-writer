const express = require('express'),
	app = express(),
	path = require('path'),
	bodyParser = require('body-parser'),
	exphbs = require('express-handlebars'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	session = require('express-session'),
	mongoose = require('mongoose'),
	ideas = require('./routes/ideas'),
	passport = require('passport'),
	users = require('./routes/users'),
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
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.error = req.flash('error')
	res.locals.user = req.user || null
	next()
})

app.get('/', (req, res) => {
	const title = 'Welcome'
	res.render('index', {
		title,
	})
})

app.get('/about', (req, res) => {
	res.render('about')
})

app.use('/ideas', ideas)
app.use('/users', users)

app.listen(port, () => {
	console.log(`Server is online at Port ${port}.`)
})
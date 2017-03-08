/**
 * Module dependencies.
 */
let express = require('express');
let path = require('path');

let routes = require('./routes');
let entries = require('./routes/entries');
let login = require('./routes/login');
let api = require('./routes/api');
let register = require('./routes/register');

let Entry = require('./lib/entry');
let messages = require('./lib/messages');
let validate = require('./lib/middleware/validate');
let page = require('./lib/middleware/page');
let user = require('./lib/middleware/user');

let app = express();

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon()).
use(express.logger('dev')).
use(express.bodyParser()).
use(express.methodOverride()).
use(express.cookieParser('your secret here')).
use(express.session()).
use(express.static(path.join(__dirname, 'public'))).
use('/api', api.auth).
use(user).
use(messages).
use(app.router).
use(routes.notFound).
use(routes.error);

//development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/post', entries.form);
app.post('/post',
	validate.required('entry[title]'),
	validate.lengthAbove('entry[title]', 4),
	entries.submit
);

app.get('/api/user/:id', api.user);
app.post('/api/entry', entries.submit);
app.get('/api/entries/:page?', page(Entry.count), api.entries);
app.get('/:page?', page(Entry.count, 5), entries.list);

if (process.env.ERROR_ROUTE) {
	app.get('/dev/error', (req, res, next) => {
		let err = new Error('database connection failed');
		err.type = 'database';
		next(err);
	});
}

app.listen(app.get('port'), function() {
	console.log('Express server listening on port' + app.get('port'));
});
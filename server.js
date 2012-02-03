/**
 * User: Taha
 * Date: 12/30/11
 */
var express = require('express'),
	combo   = require('combohandler'),
	users = require('./mockdata/users'),
	customerdata = require('./mockdata/customerdata'),
	lookups = require('./mockdata/lookups'),
	//fs = require('fs'),

	app    = express.createServer(),
	port   = process.env.PORT || 3000,
	pubDir = __dirname + '/public';


// Middleware
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', { layout: false });
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "Coffeebreak",
		cookie: { maxAge: 600000 }
	})
	);

	app.use(express.logger({format: ':response-time ms - :date - :referrer'}));
	app.use(express.static(pubDir));

});

// Combo-handler for JavaScript.
app.get('/js', combo.combine({rootPath: pubDir + '/js'}), function (req, res) {
	res.send(res.body, 200);
});

//user selection
app.get('/', function (req, res) {
	res.sendfile('index.htm');
});

function PermissionError(msg){
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}
PermissionError.prototype.__proto__ = Error.prototype;

app.error(function(err, req, res, next){
	if (err instanceof PermissionError) {
		res.render('error.jade', { title: 'Permissions Error' });
	} else {
		next(err);
	}
});


function LoginError(msg){
	this.name = 'LoginRequired';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}
LoginError.prototype.__proto__ = Error.prototype;
app.error(function(err, req, res, next){
	if (err instanceof LoginError) {
		res.redirect('/');
	} else {
		next(err);
	}
});

app.post('/login', function (req, res) {
	var params = req.body;
	console.log('req.session.user = ' + req.session.user);
	req.session.regenerate(function() {
		req.session.user = params.userName;
		res.redirect('/dashboard');
	});
});

function readUser(req, res, next) {

	var user = users.filter(function (value) {
		return (value.userName == req.session.user);
	})[0];
	if (!user) {
		next(new LoginError('Please login'));
	}
	else {
		req.user = user;
		next();
	}
}

function restrictToAccountRead(req, res, next) {
	var user = req.user;
	if (user.permissions.indexOf('ACCOUNT_READ') > -1) {
		next();
	}
	else {
		next(new PermissionError('Not Allowed'));
	}
}

app.get('/dashboard', function (req, res) {
	res.render('dashboard.jade', { title: 'Dashboard' });
});

app.get('/customer/', readUser, restrictToAccountRead, function (req, res) {
	res.render('customers.jade', { title: 'Customers' });
});


app.get('/customer/lookups', function (req, res) {
	sleep(0.05);
	res.json(lookups, 200);

});

//just to mimic some delay in backend processing
function sleep(t) {
	var now = new Date().getTime();
	while(new Date().getTime() < now + (t*1000)) {
		// do nothing
	}
}

app.get('/customer/list', function (req, res) {
	console.log('customer listing ...');
	console.log('req.session.user = ' + req.session.user);
	sleep(0.2);
	res.json(customerdata, 200);

});

app.get('/customer/get', function(req, res){
	console.log(req.query);
	console.log('req.session.user = ' + req.session.user);
	var customerId = global.parseInt(req.query.id);
	var customer = customerdata.filter( function(record) {
		return record.id == customerId;
	});
	sleep(0.1);
	res.json(customer[0], 200);
});

app.del('/customer/delete', function(req, res){
	var ids = [];
	for (var key in req.query) {
		ids.push(global.parseInt(req.query[key]));
	}

	console.log(ids);
	customerdata = customerdata.filter( function(record) {
		return ids.indexOf(record.id) < 0;
	});
	res.json(customerdata, 200);

});

//allows for all sub-paths for customer app
app.get(/^\/(?:(?:customer)\/\d+\/)$/, function (req, res) {
	res.render('customers.jade', { title: 'Customers' });
});


app.listen(port, function () {
	console.log('Server listening on ' + port);
});

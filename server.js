/**
 * Created by JetBrains WebStorm.
 * User: Taha
 * Date: 12/30/11
 * Time: 7:28 PM
 * To change this template use File | Settings | File Templates.
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

/*
app.configure(function () {
    console.log('express static on ' + pubDir);
    app.use(express.static(pubDir));
});
*/
// Combo-handler for JavaScript.
app.get('/js', combo.combine({rootPath: pubDir + '/js'}), function (req, res) {
    console.log('serving js file request');
    res.send(res.body, 200);
});

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
		console.log('found user = ' + user.firstName + ' ' + user.lastName);
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
	console.log('req.session.user = ' + req.session.user);
	res.render('dashboard.jade', { title: 'Dashboard' });
	//res.sendfile('dashboard.htm');
});

/*
app.get('/template', function (req, res) {
    console.log('serving template request');
    res.json('<div id="customer-form"><div><label for="id">ID</label><br/></div></div>');
});
  */

app.get('/customer/', readUser, restrictToAccountRead, function (req, res) {
	console.log('req.session.user = ' + req.session.user);
    //res.sendfile('customer.htm');
	res.render('customers.jade', { title: 'Customers' });
});


app.get('/customer/lookups', function (req, res) {
    console.log('getting lookups ...');
	console.log('req.session.user = ' + req.session.user);
	sleep(0.05);
	res.json(lookups, 200);

});

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

	console.log(customer);
/*
	var ids = [];
	for (var key in req.query) {
		ids.push(global.parseInt(req.query[key]));
	}

	console.log(ids);
	customerdata.customerdata = customerdata.customerdata.filter( function(record) {
		return ids.indexOf(record.id) < 0;
	});
	console.log(customerdata.customerdata);
	*/
	sleep(0.1);
	res.json(customer[0], 200);

	//res.redirect('/customer/list', 302);
});

app.del('/customer/delete', function(req, res){
    console.log(req.query);

    var ids = [];
    for (var key in req.query) {
        ids.push(global.parseInt(req.query[key]));
    }

    console.log(ids);
    customerdata = customerdata.filter( function(record) {
        return ids.indexOf(record.id) < 0;
    });
    console.log(customerdata);
	res.json(customerdata, 200);

	//res.redirect('/customer/list', 302);
});


/**
 Restrict to only known paths that the app can respond to:

 - "/place/:id/"
 - "/photo/:id/"

 Redirects back to "/" with the URL as a fragment, e.g. "/#/photo/:id/"
 **/
/*
app.get(/^\/(?:(?:place|photo)\/\d+\/)$/, function (req, res) {
    res.redirect('/#' + req.url, 302);
});
*/

app.get(/^\/(?:(?:customer)\/\d+\/)$/, function (req, res) {
	res.render('customers.jade', { title: 'Customers' });
	//res.sendfile('customer.htm');
	//console.log('req.url = ' + req.url);
	//res.redirect('/#' + req.url, 302);
});


app.listen(port, function () {
    console.log('My Server listening on ' + port);
});

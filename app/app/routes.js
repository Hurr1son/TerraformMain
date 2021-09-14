// app/routes.js

var tools = require('../config/tools');
var customers = require('../config/customers');
var rentedTools = require('../config/rentedTools');
var payments = require('../config/payments');

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs',{ title: 'Authentication' }); // load the index.ejs file
	});

	
	
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/loggedin', function(req, res) {

		// render the page and pass in any flash data if it exists
		//res.render('login.ejs', { message: req.flash('loginMessage') });
		 res.send(req.isAuthenticated() ? req.user : '0');
		
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
           // successRedirect : '/profile', // redirect to the secure profile section
           // failureRedirect : '/login', // redirect back to the signup page if there is an error
           // failureFlash : true // allow flash messages
		}),
        function(req, res) {
		 res.send(req.user);
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		//res.render('signup.ejs', { message: req.flash('signupMessage') });
	
		res.send(req.user);
	 

	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		//successRedirect : '/profile', // redirect to the secure profile section
		//failureRedirect : '/signup', // redirect back to the signup page if there is an error
		//failureFlash : true // allow flash messages
	}),
	  function(req, res) {
		 res.send(req.user);
   });

	//HOME PAGE/////////////////
	app.post('/home', function(req, res) {
		
		//populate tools from the tools table.
		tools.get(res);
		
	});
	
	//RENT PAGE/////////////////
	app.post('/rent', function(req, res) {
		
		//populate tools from the tools table.
		tools.get(res);
		
	});
	
	
	
///INSERT RENTED_TOOL INFO
	app.post('/rented', function(req, res) {
		
		//rentedTools.create(req.body,req.body.customer_id,req.body.payment_id,res);	
		rentedTools.create(req.body,res);
		
	});
	
	///
	//RENT SELECTED TOOL PAGE/////////////////
	
	app.post('/select', function(req, res) {
	
		//retreive customer's data for a selected user_id
		
		//insert form data into the Database customers table
		customers.create(req.body, res);
		
		
	});
	
	app.get('/select', function(req, res) {
		
		var user_id = req.param('user_id');
		customers.getDataforUserId(user_id, res);
		
	});
	
	///////ADDRESS PAGE/////////////////
	
	app.get('/address', function(req, res) {
		
		var user_id = req.param('user_id');
		customers.getDataforUserId(user_id, res);
		
	});
	
	
	//get selected address row
	  app.get('/selectedaddress/:id/', function(req, res) {
		
			customers.getSelectedId(req.params.id, res);
			
		});
	
	 app.delete('/address/:id/', function(req, res) {
		 customers.delete(req.params.id, res);
	  });
	/*app.post('/address', function(req, res) {
		
		rentedTools.create(req.body,req.body.customer_id,res);	
		
	});
	*/
 //PAYMENT PAGE/////////////////
	
	app.post('/payment', function(req, res) {
		
		payments.create(req.body,res);	
		
	});
	
	app.get('/payment', function(req, res) {
		
		var user_id = req.param('user_id');
		payments.getDataforUserId(user_id, res);
		
	});
	
	 app.delete('/payment/:id/', function(req, res) {
		 payments.delete(req.params.id, res);
	  });
	 
	 //get selected payment row
	  app.get('/selectedpayment/:id/', function(req, res) {
		
			payments.getSelectedId(req.params.id, res);
			
		});
	 
  //SUMMARY SELECTED TOOL PAGE/////////////////
	
	app.get('/summary', function(req, res) {
		
		var rented_tool_id = req.param('id');
		
		rentedTools.getAllRentedInfo(rented_tool_id,res);
		
		//req.params.id
		
	});
	
//  RENTAL HISTORY  PAGE/////////////////
	
	app.get('/history', function(req, res) {
		
		var user_id = req.param('user_id');
		var rows = '';
		rentedTools.getAllForSelectedUser(user_id,res);
		
		/*
    	var toolArray = [];
    	
    	var index=0;
    	var row = '';
    	//console.log('tool selected '+	rows.toSource());
    	if(rows != undefined){
    		
    		Object.keys(rows).forEach(function (key) {
        		
        		row = Tools.getSelectedTool(rows[key].id, res, true);
        		
        		//toolArray[index++]=[selected_info[key]];
        		
        		console.log('tool selected '+	row.toSource());
        	});
        	
    	}//if(rows !=''){
    	*/
		
	});
	
	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		//res.render('profile.ejs', {
		//	user : req.user // get the user out of session and pass to template
		//}
	
		//);
		
		res.send(req.user);
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

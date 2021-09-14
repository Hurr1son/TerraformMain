// config/customers.js

// load up the user model
var rentedTools = require('../config/rentedTools');
var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


function Customers() {
	
 this.get = function(res) {
	  connection.query('SELECT * FROM customers',function(err,rows){
		  if(err) throw err;
		  res.send(rows);
		  
		});
  };
 
  this.getDataforUserId=function(user_id,res){
	  
	  connection.query('SELECT * FROM customers where user_id=?',[user_id],function(err,rows){
		  if (err) {
	          res.send({status: 1, message: 'Customer populating failed '+err });
	        } else {
	        	
	          res.send({status: 0, rows:rows});
	         
	        }//else
		});
	  
  };
  
  
 this.getSelectedId = function(customer_id,res){
	  
	  connection.query('SELECT * FROM customers where id=?',[customer_id],function(err,rows){
		  if (err) {
	          res.send({status: 1, message: 'customers populating failed '+err });
	        } else {
	   
	        	res.send({status: 0, row:rows});
	        	
	        }//else
		});
	  
  }
  
  this.create = function(customerData, res){
	 // var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
	 var datetime = (new Date()).toISOString().substring(0, 19).replace('T', ' ');
	  //var datetime = new Date().toJSON().slice(0,10);
	  var insertQuery = "INSERT INTO customers ( first_name, last_name, street1, street2, city, state, zip,email,phone, user_id,timestamp ) values (?,?,?,?,?,?,?,?,?,?,?)";

		connection.query(insertQuery,[customerData.first_name, customerData.last_name,  customerData.street1,customerData.street2,customerData.city,
	                                    customerData.state, customerData.zip, customerData.email, customerData.phone,customerData.user_id,datetime], function(err, result) {
			
        if (err) {
          res.send({status: 1, message: 'Customer creation failed '+err });
        } else {
        	
        	//get the id from the new customer row just created.
        	var customer_id  = result.insertId;
        	//customerData.customer_id = customer_id;
        	
        	 res.send({status: 0, customer_id: customer_id});
        	//now insert the rented tool data here.
        	//rentedTools.create(customerData,res);	
         
        }//else
      });
      
   
  };

  this.update = function(customer, res) {
    connection.acquire(function(err, con) {
      con.query('update customers set ? where id = ?', [customer, customer.id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'TODO update failed'});
        } else {
          res.send({status: 0, message: 'TODO updated successfully'});
        }
      });
    });
  };

  this.delete = function(id, res) {
	  connection.query('delete  FROM customers where id=?',[id],function(err,result){
		  if (err) {
	          res.send({status: 1, message: 'customer deleting '+id+' failed '+err });
	        } else {
	
	        	 //var payment_id = result.deleteId;
	          	//res.send({status: 0, payment_id:  payment_id});
	         	res.send({status: 0, message:  'delete the customer id '+id});
	      	
	        }//else
		});
  	};
}

module.exports = new Customers();

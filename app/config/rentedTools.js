// config/rentedTools.js

// load up the rented_tools model
var tools = require('../config/tools');
var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


function RentedTools() {
	
 this.get = function(res) {
	  connection.query('SELECT * FROM rented_tools',function(err,rows){
		  if(err) throw err;
		  res.send(rows);
		  
		});
  };
 
  
  this.getAllRentedInfo = function(id,res) {
	  connection.query('select t.type  tool_type, t.name  tool_name, t.price, c.first_name, c.last_name, c.street1, c.street2, c.city, c.state, c.zip ,p.type  card_type, p.name  card_name, p.number card_number, p.month, p.year   from rented_tools as rt, customers as c, tools as t, payments as p where rt.tool_id = t.id and rt.customer_id = c.id and  rt.payment_id = p.id and rt.id = ?',[id],function(err,rows){
		  if (err) {
	          res.send({status: 1, message: 'rented tool retreive failed '+err });
	        } else {
	        	// var rented_id = result.insertId;
	         	res.send(rows);
	        	//res.send({status: 0, message: 'rented tools updated successfully'});
	        }
		});
  };
  
  this.getAllForSelectedUser = function(user_id, res){
	  
	  connection.query('select * from rented_tools as rt, tools as t where rt.tool_id = t.id and user_id = ? order by rented_date desc',[user_id],function(err,rows){
		  if (err) {
	          res.send({status: 1, message: 'rented tool retreive failed '+err });
	        } else {
	        	
	        	if(rows != ''){
	        		//res.send({status: 0, message: 'tool_row updated successfully'+JSON.stringify(rows, null, 4)});
	        		res.send({status:0, rows:rows})
	        	
	        	}//if(rows !=''){
	        	else{
	        		
	        		res.send({status:0, rows:null})
	        	}
	        }
		});
	  
  };
  
  this.create = function(data, res){
	 // var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
	 var datetime = (new Date()).toISOString().substring(0, 19).replace('T', ' ');
	  //var datetime = new Date().toJSON().slice(0,10);
	  var insertQuery = "INSERT INTO rented_tools ( user_id,tool_id, customer_id, payment_id,rented_date ) values (?,?,?,?,?)";

		connection.query(insertQuery,[data.user_id,data.tool_id, data.customer_id, data.payment_id, datetime], function(err, result) {
			
        if (err) {
          res.send({status: 1, message: 'rented tool creation failed '+err });
        } else {
        	 var rented_id = result.insertId;
         	res.send({status: 0, rented_id:  rented_id});
        	//res.send({status: 0, message: 'rented tools updated successfully'});
        }
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
    connection.acquire(function(err, con) {
      con.query('delete from tools where id = ?', [id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Failed to delete'});
        } else {
          res.send({status: 0, message: 'Deleted successfully'});
        }
      });
    });
  };
}

module.exports = new RentedTools();

// config/customers.js

// load up the user model
var rentedTools = require('../config/rentedTools');
var crypto = require('../config/crypto');
var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


function Payments() {
	
 this.get = function(res) {
	  connection.query('SELECT * FROM payments',function(err,rows){
		  if(err) throw err;
		  res.send(rows);
		  
		});
  };
 
  this.getSelectedId = function(payment_id,res){
	  
	  connection.query('SELECT * FROM payments where id=?',[payment_id],function(err,rows){
		  if (err) {
	          res.send({status: 1, message: 'payments populating failed '+err });
	        } else {
	   
	        	var number='';
	        	for (var j = 0; j < rows.length; j++){
	        		
	        		Object.keys(rows[j]).forEach(function (key) {
	    	    		
	    	    		if(key=="number"){
	    	    			number = String(rows[j][key]);
	    	    			rows[j][key]  = crypto.decrypt(number);
	    	    			//console.log(rows[j][key]);
	    	    		}
	        			
	    	    	});
	        		
	        	}//for (var j = 0; j < rows.length; j++){
	     
	        	//console.log(rows);
	        	res.send({status: 0, row:rows});
	        	
	        }//else
		});
	  
  }
  
  this.getDataforUserId=function(user_id,res){
	  
	  connection.query('SELECT * FROM payments where user_id=?',[user_id],function(err,rows){
		  if (err) {
	          res.send({status: 1, message: 'payments populating failed '+err });
	        } else {
	        	
	            var number='';
	        	for (var j = 0; j < rows.length; j++){
	        		
	        		Object.keys(rows[j]).forEach(function (key) {
	    	    		//console.log(rows[j]["number"]);
	        			
	    	    		//number = crypto.decrypt('4669963c6d6a4c4ebbbf5da824f025e9c83fba');
	    	    		//console.log(key);
	    	    	
	    	    		if(key=="number"){
	    	    			number = String(rows[j][key]);
	    	    			rows[j][key]  = crypto.decrypt(number);
	    	    			//console.log(rows[j][key]);
	    	    		}
	        			
	    	    	});
	        		
	        	}//for (var j = 0; j < rows.length; j++){
	       
	        	res.send(rows);
	      	
	        }//else
		});
	  
  };
  
  this.create = function(PaymentData, res){
	 // var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
	 var datetime = (new Date()).toISOString().substring(0, 19).replace('T', ' ');
	  //var datetime = new Date().toJSON().slice(0,10);
	 
	 //ecrypt the card number and security code
	  var number = crypto.encrypt(PaymentData.number);
	  var securityCode = crypto.encrypt(PaymentData.securityCode);
	  
	  var insertQuery = "INSERT INTO payments ( type, name, number, securityCode, month, year, user_id,timestamp) values (?,?,?,?,?,?,?,?)";

		connection.query(insertQuery,[PaymentData.type, PaymentData.name,  number,securityCode,PaymentData.month,
		                              PaymentData.year.trim(), PaymentData.user_id,datetime], function(err, result) {
			
        if (err) {
          res.send({status: 1, message: 'Payment creation failed '+err });
        } else {
        	
        	 var payment_id = result.insertId;
          	res.send({status: 0, payment_id:  payment_id});
        }//else
      });
      
   
  };
  
  this.delete = function(id, res) {
	  connection.query('delete  FROM payments where id=?',[id],function(err,result){
		  if (err) {
	          res.send({status: 1, message: 'payments deleting '+id+' failed '+err });
	        } else {
	
	        	 //var payment_id = result.deleteId;
	          	//res.send({status: 0, payment_id:  payment_id});
	         	res.send({status: 0, message:  'delete the payment id '+id});
	      	
	        }//else
		});
  	};

}//function Payments() {

module.exports = new Payments();

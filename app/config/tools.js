// config/tool.js

// load up the user model
var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


function Tools() {
	
 this.get = function(res) {
	  connection.query('SELECT * FROM tools',function(err,rows){
		  if(err)  res.send({status: 1, message: 'TOOL retreive failed' + err});
		  else
		  res.send(rows);
		  
		});
  };
  
  this.getSelectedTool = function(id,res) {
	 //if return_value is true, just return the retreived row.
	  connection.query('SELECT * FROM tools where id = ?',[id],function(err,row){
		 
			  
			  if(err)  res.send({status: 1, message: 'TOOL retreive failed' + err});
			  else{
				  res.send(row);
				 
				// res.send({status: 0, message: 'tools retreive success' + JSON.stringify(row, null, 4)});
				//console.log('tool selected '+	row);
			  }
				
			
		
	
		});
  };
 
  this.create = function(todo, res) {
    connection.acquire(function(err, con) {
      con.query('insert into tools set ?', todo, function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'TODO creation failed'});
        } else {
          res.send({status: 0, message: 'TODO created successfully'});
        }
      });
    });
  };

  this.update = function(todo, res) {
    connection.acquire(function(err, con) {
      con.query('update tools set ? where id = ?', [todo, todo.id], function(err, result) {
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

module.exports = new Tools();
/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

//create payments table
connection.query('\
		CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.payments_table + '` (\
			  `id` int(11) NOT NULL AUTO_INCREMENT,\
			  `type` text,\
			 `name` text,\
			  `number` text,\
			  `securityCode` text,\
			  `month` text,\
			  `year` text,\
			  `user_id` int(10) DEFAULT NULL,\
			  `timestamp` datetime DEFAULT NULL,\
			  PRIMARY KEY (`id`)\
			); ');
	   
//create the users table
connection.query('\
   CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
   )');
   
 //create customers table
connection.query('\
		CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.customers_table + '`(\
		`id` int(11) NOT NULL AUTO_INCREMENT,\
	    `first_name` text,\
	    `last_name` text,\
	    `street1` text,\
	    `street2` text,\
	    `city` text,\
		`state` text,\
		`zip` text,\
		`email` text,\
		`phone` text,\
		`user_id` int(10) DEFAULT NULL,\
		`timestamp` datetime DEFAULT NULL,\
		PRIMARY KEY (`id`)\
	   );');

//create rented_tool table
connection.query('\
		CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.rented_tools_table + '`(\
		`id` int(11) NOT NULL AUTO_INCREMENT,\
		`user_id` int(11) DEFAULT NULL,\
		`tool_id` int(11) DEFAULT NULL,\
		`customer_id` int(11) DEFAULT NULL,\
		`payment_id` int(11) DEFAULT NULL,\
		`rented_date` datetime DEFAULT NULL,\
		PRIMARY KEY (`id`)\
	);');

//create tools table
connection.query('\
		CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.tools_table + '` (\
		`id` int(11) NOT NULL AUTO_INCREMENT,\
		`type` text,\
		`name` text NOT NULL,\
		`description` text,\
		`available` tinyint(4) DEFAULT NULL,\
		`price` decimal(13,2) DEFAULT NULL,\
		PRIMARY KEY (`id`)\
	);');

//insert some tool data values into the tool table.
connection.query("\
		INSERT INTO `" + dbconfig.database + "`.`" + dbconfig.tools_table + "` VALUES (1,'Small Drain Cleaners ','Toilet Auger','This handy auger has extra flexible 3 Ft. \"music wire\" cable that works well in all types of toilets. Easy-to-use and easy to store in a closet or corner.',1,140.00),(2,'Small Drain Cleaners ','Drill Unit Drain Cleaner 25 x 5/16\"','This handy drain cleaner works well on small, inside drain lines up to 35 Ft. The cable drum is lightweight stainless steel providing excellent durability and corrosion resistance. An easy-to-tighten Jacobs cable chuck fits securely in place and resists rust. The cable is constructed of certified music wire.',1,160.00),(3,'Medium Drain Cleaners ','Drain Cleaner 50 x 1/2\" ','The compact drain cleaner has a steel inner-drum for long lasting dependability, an epoxy coated cage, cord wraps, a belt guard that makes maintenance and repair easier, and a rear bar for motor protection. The cable is tough genuine galvanized aircraft wire inner core. ',1,170.00),(4,'Medium Drain Cleaners ','Drain Cleaner 75 x 1/2\"  ','This drain cleaner drives up to 75 feet of 1/2\" cable for cleaning 1-1/4\" - 3\" lines and has a passive wheel brake to lock the machine in position on the job. A folding handle makes it easier to load into a car trunk. Brand may differ from the item shown; please ask an associate for details ',1,180.00);");


console.log('Success: Database Created!')

connection.end();

// config/database.js
var mysqlh = process.env.DB_HOST;
var mysqlu = process.env.DB_USER;
var mysqlp = process.env.DB_PASS;
var mysqld = process.env.DB_NAME;

module.exports = {
    'connection': {
        'host': mysqlh,
        'user': mysqlu,
        'password': mysqlp
    },
	'database': mysqld,
    'users_table': 'users',
    'payments_table':'payments',
    'customers_table':'customers',
    'rented_tools_table':'rented_tools',
    'tools_table':'tools'
};
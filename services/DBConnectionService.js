const mysql = require('mysql');

const db = require('../Db_config');

/*
const con = mysql.createConnection({
	
	host: "",
	user: "",
	password: "",
	database: "sites_visit"
});
*/
console.log(db);
const con = mysql.createConnection(
	db
);


con.connect(function(err) {
	
    if (err) {
        throw err;
    }
});


module.exports = con;









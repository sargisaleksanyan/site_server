var express = require('express');
var router = express.Router();

var bodyParser = require("body-parser");

const urlencodedParser = bodyParser.urlencoded({extended: false});

const auth = require('../services/AuthService');

let con = require('../services/DBConnectionService');
let dateTime = require('../services/DateTimeService');


router.get("/api/domains", auth.filter, function(request, response) {
	
	let sql = "SELECT id, url, category, type, last_visited, notes FROM domains ORDER BY last_visited DESC";
	con.query(sql, function (err, results, fields) {
	  
		if (err) {
			throw err;	
		}			

		response.send(results);		
	});
});


router.post("/api/domains", auth.filter, urlencodedParser, function (request, response) {
	 
    if (! request.body) 
		return response.sendStatus(400);
	
    var domain = request.body;
	
	new Promise((resolve, reject) => {

		con.query("SELECT 1 FROM domains WHERE url = ?", [domain.url], function (err, results, fields) {

			if (err) {
				reject(err);
			}
			else {
				resolve(results, fields);
			}
		});	
	})
	.then((results, fields) => {

		if (results.length !== 0) {
			return response.status(409).send("Such Domain already exists !");
		}
		
		var sql = "INSERT INTO domains (url, category, type, last_visited, notes) VALUES (?, ?, ?, NOW(), ?)";
		con.query(sql, [domain.url, domain.category, domain.type, domain.notes], function (err, result) {
			
			if (err) throw err;
			
			domain.id = result.insertId;	
			domain.last_visited = dateTime.curTimeDbFormat();
			
			response.send(domain);
		});	
	}) 
	.catch(error => {
		throw error;	
	});
});


router.put("/api/domains/lastvisited", urlencodedParser, function(request, response) {	
	
    if (! request.body) 
		return response.sendStatus(400);
	
	var sql = "UPDATE domains SET last_visited = NOW() WHERE id = ?";
	con.query(sql, [request.body.id], function (err, result) {
		
		if (err) 
			throw err;		
	
		let strDate = dateTime.curTimeDbFormat();
	
		response.send({ time: strDate });
	});
});


router.put("/api/domains", auth.filter, urlencodedParser, function(request, response) {
      
    if (! request.body) 
		return response.sendStatus(400);

	var domain = request.body;
	
	var sql = "UPDATE domains SET url = ?, category = ?, type = ?, notes = ? WHERE id = ?";
	con.query(sql, [domain.url, domain.category, domain.type, domain.notes, domain.id], function (err, result) {
		
		if (err) throw err;	
		
		response.send(domain);
	});	
});


router.delete("/api/domains/:id", auth.filter, urlencodedParser, function(request, response) {
      
    var id = request.body.id;
	
	new Promise((resolve, reject) => {
		
		con.query("DELETE FROM domains WHERE id = ?", [id], function (err, result) {				
			
			if (err) {
				reject(err);
			}
			else {
				resolve(result);
			}			
		});
	})
	.then((result) => {
		
		con.query("DELETE FROM pages_posts WHERE domain_id = ?", [id], function (err, result) {
			
			if (err) throw err;	
			
			response.send(id);
		});	
	}) 
	.catch(error => {
		throw error;
	});
});


module.exports = router;

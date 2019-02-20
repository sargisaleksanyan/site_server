var express = require('express');
var router = express.Router();

var bodyParser = require("body-parser");

const urlencodedParser = bodyParser.urlencoded({extended: false});

const auth = require('../services/AuthService');

let con = require('../services/DBConnectionService');
let dateTime = require('../services/DateTimeService');


router.get("/api/pagesposts/all", auth.filter, function(request, response) {
	
	var sql = "SELECT id, url, category, type, status, last_visited, notes FROM pages_posts ORDER BY last_visited DESC";
	con.query(sql, function (err, results, fields) {
	  
		if (err) throw err;

		response.send(results);
	});
});


router.get("/api/pagesposts", auth.filter, function(request, response) {
	  
	if (typeof request.query.domainId === "undefined") {
		return response.status(204).send();
	} 
	  
	var sql = "SELECT id, url, category, type, status, last_visited, notes FROM pages_posts WHERE domain_id = ? ORDER BY last_visited DESC";
	con.query(sql, [request.query.domainId], function (err, results, fields) {
	  
		if (err) throw err;		

		response.send(results);	
	});
});


router.post("/api/pagesposts", auth.filter, urlencodedParser, function (request, response) {
	 
    if (! request.body) 
		return response.sendStatus(400);
	
    var pagePost = request.body;
	
	if (typeof pagePost.domain_id === "undefined") {
		return response.status(404).send("Domain not specified !");
	}
	
	new Promise((resolve, reject) => {
	
		con.query("SELECT 1 FROM pages_posts WHERE url = ?", [pagePost.url], function (err, results, fields) {
			
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
			return response.status(409).send("Such Page/Post already exists !");
		}
		
		var sql = "INSERT INTO pages_posts (domain_id, url, category, type, status, last_visited, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?)";
		con.query(sql, [pagePost.domain_id, pagePost.url, pagePost.category, pagePost.type, pagePost.status, pagePost.notes], function (err, result) {
			
			if (err) throw err;
			
			pagePost.id = result.insertId;
			pagePost.last_visited = dateTime.curTimeDbFormat();
			
			response.send(pagePost);
		});
	}) 
	.catch(error => {
		throw error;	
	});	
});


router.put("/api/pagesposts/lastvisited", urlencodedParser, function(request, response) {	
	
    if (! request.body) 
		return response.sendStatus(400);

	var sql = "UPDATE pages_posts SET last_visited = NOW() WHERE id = ?";
	con.query(sql, [request.body.id], function (err, result) {
		
		if (err) throw err;
	
		let strDate = dateTime.curTimeDbFormat();
	
		response.send({ time: strDate });
	});
});
	
	
router.put("/api/pagesposts", auth.filter, urlencodedParser, function(request, response) {
      
    if (! request.body) 
		return response.sendStatus(400);

	var pagePost = request.body;
	
	var sql = "UPDATE pages_posts SET url = ?, type = ?, category = ?, status = ?, notes = ? WHERE id = ?";
	con.query(sql, [pagePost.url, pagePost.category, pagePost.type, pagePost.status, pagePost.notes, pagePost.id], function (err, result) {
		
		if (err) throw err;
		
		response.send(pagePost);
	});	
});


router.delete("/api/pagesposts/:id", auth.filter, urlencodedParser, function(request, response) {

    var id = request.body.id;
	
	var sql = "DELETE FROM pages_posts WHERE id = ?";
	con.query(sql, [id], function (err, result) {
		
		if (err) throw err;
		
		response.send(id);
	});
});


module.exports = router;

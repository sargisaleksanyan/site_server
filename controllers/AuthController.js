var express = require("express");
var router = express.Router();

var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});

const auth = require("../services/AuthService");


router.post("/signin", urlencodedParser, async function(req, res, next) {
	try {		
		var user = req.body;
	
		let isExists = await auth.isUserPasswordCorrect(user);		
		if (isExists) {
			
			req.session.user = user;
			return res.redirect("/");		
		}		
		
		res.status(401).send(
			`<span style="color: red;">Wrong Login or Password !</span>
			<br />
			<a href="javascript:history.back()">Back</a>`);
		
		return;
	} 
	catch (err) {
		throw err;
	}
});


router.get("/signout", function(req, res) {	

	if (req.session) {
		req.session.destroy();
	}
	
	res.redirect("../signup_form.html");
});


module.exports = router;

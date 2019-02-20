
let con = require('./DBConnectionService');


function filter(req, res, next) {

	if (typeof req.session.user === "undefined") {
		
		res.redirect("/signup_form.html");
		return;
	}

	next();
}


function isUserPasswordCorrect(user) {
	
	return new Promise((resolve, reject) => {	
	
		let sql = "SELECT 1 FROM user WHERE name = ? AND password = ?";
		con.query(sql, [user.username, user.password], function (err, results, fields) {
		
			if (err) {
				reject(err);
			}		
			else if (results.length === 0) {
				resolve(false);
			}
			else {
				resolve(true);
			}		
		});
	});
}


module.exports = {
	
    filter: filter,
	isUserPasswordCorrect: isUserPasswordCorrect
};

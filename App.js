const express = require("express");
const app = express();
const port = process.env.PORT || 3005;
app.use(express.static(__dirname + "/public"));


var session = require("express-session");
app.use(session({
    secret: "Shh, its a super-secret-key!",
    resave: true,
    saveUninitialized: true
})); // session secret


app.use("/auth", require("./controllers/AuthController"));
app.use(require("./controllers/DomainController"));
app.use(require("./controllers/PagesPostsController"));

const auth = require("./services/AuthService");


app.listen(port, (err) => {
    if (!err) {
        console.log(`App is running on port ${port}`)
    }
});


//http://localhost:3001/
app.get("/", auth.filter, function (req, res, next) {

    //res.send('Home page');
    res.sendFile(__dirname + "/views/index.html");
    //res.render(__dirname + "/views/index.html");
});

















var express = require("express");
var app = express();
app.get("/", function (req, res) {
    res.send("Welcome");
});

var server = app.listen(4242, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

var server = app.listen(4242, function () {  
var host = server.address().address  
var port = server.address().port  
    console.log("Example app listening at http://%s:%s", host, port)  
})
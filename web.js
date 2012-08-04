var express = require('express');

var app = express.createServer(express.logger());

app.configure(function() {
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(__dirname));
});


var port = process.env.PORT || 3001;
app.listen(port, function() {
	console.log("Listening on " + port);
});

app.get('/', function(req, res) {
    res.send('hello world');
//    res.sendfile('/test/gofigure_test.html');
});


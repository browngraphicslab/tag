var http = require('http');
var fs   = require('fs');

var port = 8080;

http.createServer(function (req, res) {
	console.log('request headers: '+req.headers.telemetryType);
	res.writeHead(200, {
		'Content-Type': 'text/plain',
		'Access-Control-Allow-Origin': '*'
	});
	console.log('response headers: '+res.headers);
	res.end('Hello World\n');
}).listen(port, '127.0.0.1');

console.log('Server running at http://127.0.0.1:'+port+'/');
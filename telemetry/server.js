/**
 * A basic telemetry server. Should probably be hooked up with a DB.
 * @class Telemetry
 * @constructor
 */

(function Telemetry() {
	// node modules
	var http = require('http'),
	    fs   = require('fs'),
	    qs   = require('querystring');

	// some constants
	var PORT = 9999,
		NOT_AVAIL = "_",
	    MAX_BODY_LENGTH = Math.pow(10,6);

	// create server
	http.createServer(function (request, response) {
		switch(request.method.toLowerCase()) {
			case 'post':
				handlePost(request, response);
				break;
			case 'get':
				handleGet(request, response);
				break;
			default:
				console.log('======= UNSUPPORTED REQUEST TYPE =======');
				console.log('sent at: '+(new Date().toString()));
		}
	}).listen(PORT, '127.0.0.1');

	/**
	 * Handles a post request to the server. Generally, writes data to log file.
	 * In the future, this should probably log data in a database.
	 * @method handlePost
	 * @param {Object} request      the http request sent to the server
	 * @param {Object} response     a response object we'll write to and return
	 */
	function handlePost(request, response) {
		var requestBody = '',
			parsedBody,
			date = new Date(),
			tdata; // telemetry data

		// read in data from request as it becomes available
		request.on('data', function(dataChunk) {
			requestBody += dataChunk;

			// if too much data, could be malicious, cut it off. our data will be small anyway...
			if(requestBody.length > MAX_BODY_LENGTH) {
				request.connection.destroy();
			}
		});

		// when all data is read
		request.on('end', function() {
			parsedBody = qs.parse(requestBody); // parse body to js object

			// telemetry data object
			tdata = {
				time_stamp: date.getTime(),                         // milliseconds since 1970
				type: parsedBody.ttype || NOT_AVAIL,                // type of telemetry request
				ip: request.connection.remoteAddress || NOT_AVAIL,  // ip of computer that generated request
				tagserver: parsedBody.tagserver || NOT_AVAIL,       // TAG server to which computer is connected
				browser: parsedBody.browser || NOT_AVAIL,           // browser
				platform: parsedBody.platform || NOT_AVAIL,         // platform (e.g., Mac)
				time_human: date.toString()                         // human-readable time
			};

			fs.writeFile('telemetry_log.txt', JSON.stringify(tdata)+',', {flag: 'a'}, function(err){
				if(err) {
					console.log('err: '+err);
				} else {
					console.log('interaction successfully written to log:');
					console.log('       time: '+date.toString());
					console.log('       type: '+parsedBody.ttype);
					console.log('');
				}
			});

			response.writeHead(200, {
				'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': '*'
			});
			response.end(); // done creating response, don't need to send back any data
		});
	}

	/**
	 * Handles a get request to the server. SHOULD get data from server, return it to client
	 * for data viz or analysis.
	 * @method handleGet
	 * @param {Object} request          the http request to the server
	 * @param {Object} response         the response we'll send back to the client
	 */
	function handleGet(request, response) {
		var requestBody = '',
			parsedBody,
			date = new Date(),
			tdata; // telemetry data

		// read in data from request as it becomes available
		request.on('data', function(dataChunk) {
			requestBody += dataChunk;

			// if too much data, could be malicious, cut it off. our data will be small anyway...
			if(requestBody.length > MAX_BODY_LENGTH) {
				request.connection.destroy();
			}
		});

		// when all data is read
		request.on('end', function() {
			parsedBody = qs.parse(requestBody); // parse body to js object

			fs.readFile('telemetry_log.txt', {encoding: 'utf8'}, function(err, data) {
				var arr,
					i;
				if(err) {
					console.log('GET request error: '+err);
					console.log('       time: '+date.toString());
				} else {
					if(data.charAt(data.length-1) === ',') {
						data = data.slice(0, data.length-1);
					}
					arr = JSON.parse('['+data+']'); // arr is an array of telemetry data objects
					for(i=0;i<arr.length;i++) { // this isn't very efficient...should use db queries
						;
					}
				}
			});

			response.writeHead(200, {
				'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': '*'
			});
			response.end(); // done creating response, don't need to send back any data
		});
	}

	console.log('Telemetry server running at http://127.0.0.1:'+PORT+'/');
})();
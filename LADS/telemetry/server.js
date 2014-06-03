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
	    MAX_BODY_LENGTH = Math.pow(10,6),
	    WRITE_DATA = writeTDataToFile,
	    READ_DATA = readTDataFromFile,
	    LOG_FILE_PATH = 'telemetry_log.txt';

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
			printData,
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
			var i,
				key,
				tobj;

			parsedBody = JSON.parse(requestBody); // parse body to js object

			for(i=0; i<parsedBody.length; i++) {
				tobj = parsedBody[i];
				tdata = {};
				for(key in tobj) {
					if(tobj.hasOwnProperty(key)) {
						tdata[key] = tobj[key] || NOT_AVAIL;
					}
				}
				// tdata = {
				// 	time_stamp: tobj.time_stamp || NOT_AVAIL,                   // milliseconds since 1970
				// 	type:       tobj.ttype      || NOT_AVAIL,                   // type of telemetry request
				// 	tagserver:  tobj.tagserver  || NOT_AVAIL,                   // TAG server to which computer is connected
				// 	browser:    tobj.browser    || NOT_AVAIL,                   // browser
				// 	platform:   tobj.platform   || NOT_AVAIL,                   // platform (e.g., Mac)
				// 	time_human: tobj.time_human || NOT_AVAIL,                   // human-readable time
				// 	additional: tobj.additional ? JSON.stringify(tobj.additional) : NOT_AVAIL // any additional info
				// };

				WRITE_DATA(tdata);
			}

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
			console.log("about to call READ_DATA");
			READ_DATA(response);
		});
	}

	/**
	 * Writes telemetry data to a log file (specified by LOG_FILE_PATH).
	 * Set the global WRITE_DATA = writeTDataToFile to log data in this way.
	 * @method writeTDataToFile
	 * @param {Object} tdata     the telemetry data object to stringify and write to file
	 */
	function writeTDataToFile(tdata) {
		fs.writeFile(LOG_FILE_PATH, JSON.stringify(tdata)+',', {flag: 'a'}, function(err){
			if(err) {
				console.log('err: '+err);
			} else {
				console.log('interaction successfully written to log:');
				console.log('       time: '+tdata.time_human);
				console.log('       type: '+tdata.ttype);
				console.log('');
			}
		});
	}

	/**
	 * Reads telemetry data from a file (specified by LOG_FILE_PATH) and
	 * returns it to client in a response.
	 * Set the global READ_DATA = readTDataFromFile to read data in this way.
	 * @method readTDataFromFile
	 * @param {Object} tdata    the response we will eventually send back
	 */
	function readTDataFromFile(response) {
		fs.readFile(LOG_FILE_PATH, {encoding: 'utf8'}, function(err, data){
			var i,
				arr;
			
			response.writeHead(200, {
				'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': '*'
			});

			if(err) {
				console.log('err: '+err);
			} else {
				if(data.charAt(data.length-1) === ',') {
					data = data.slice(0, data.length-1); // remove trailing comma
				}
				arr = JSON.parse('['+data+']'); // arr is an array of telemetry data objects
				for(i=0;i<arr.length;i++) { // this isn't very efficient...should use db queries
					;
				}

				console.log('retrieving telemetry data succeeded:');
				console.log('       time: '+(new Date()).toString());
				console.log('');

				response.write(JSON.stringify(arr));
			}

			response.end(); // done creating response
		});
	}

	console.log('Telemetry server running at http://127.0.0.1:'+PORT+'/');
})();
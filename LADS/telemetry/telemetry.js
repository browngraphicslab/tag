var LADS.Telemetry = (function() {

	var requests  = [],
		sendFreq  = 5,  // telemetry data is sent once every sendFreq-th log
	    bversion  = browserVersion(),
	    platform  = navigator.platform;


	/**
	 * Get the current browser version
	 * Borrowed from http://stackoverflow.com/questions/5916900/detect-version-of-browser
	 * @method browserVersion
	 */
	function browserVersion() {
	    var ua= navigator.userAgent, tem, 
	    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
	    if(/trident/i.test(M[1])){
	        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
	        return 'IE '+(tem[1] || '');
	    }
	    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
	    if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	    return M.join(' ');
	}

	/**
	 * Register an element with the telemetry module
	 * @method registerTelemetry
	 * @param {jQuery Obj} element    the element to which we'll attach a telemetry event handler
	 * @param {String} etype          the type of event (e.g., 'mousedown') for which we'll create the handler
	 * @param {String} ttype          the type of telemetry request to log
	 */
	function registerTelemetry(element, etype, ttype) {
		element = $(element); // ensure we are using a jQuery object

		element.on(etype+'.tag_telemetry', function() {
			requests.push({
				ttype:      ttype,
				tagserver:  localStorage.ip || '',
				browser:    bversion,
				platform:   platform
			});

			if(requests.length % sendFreq == 0) { // tweak this later
				postTelemetryRequests();
			} 
		});
	}

	/**
	 * Make a request to the telemetry server using the requests variable
	 * @method telemetryRequests
	 */
	function postTelemetryRequests() {
		var data = JSON.stringify(requests);

		requests.length = 0;

		$.ajax({
			type: 'POST',
			url: 'http://127.0.0.1:9999/',
			data: data,
			async: true, // this is the default, but just make it explicit
			success: function() {
				console.log('POST request to server worked');
			},
			error: function(e) {
				console.log('telemetry error! look at node output...');
			}
		});
	}

	return {
		registerTelemetry: registerTelemetry
	}
})();
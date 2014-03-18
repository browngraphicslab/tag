window.onload = load;

function load() {
	initHandlers();
}

function initHandlers() {
	$('#test1').on('click', function() {
		telemetryRequest('POST', 'startPage');
	});
	$('#test2').on('click', function() {
		telemetryRequest('GET', 'collectionsPage');
	});
}

// borrowed from http://stackoverflow.com/questions/5916900/detect-version-of-browser
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
 * Make a request to the telemetry server
 * @param type      'POST' for updating data or 'GET' for getting it
 * @param data      object; data to be sent in body of request
 */
function telemetryRequest(type, ttype) {
	if(!type) {
		console.log('no request type provided!');
		return;
	}

	data = {
		ttype: ttype,
		tagserver: localStorage.ip || '',
		browser: browserVersion(),
		platform: navigator.platform
	}; 

	$.ajax({
		type: type,
		url: 'http://127.0.0.1:9999/',
		data: data,
		async: true, // this is the default, but just make it explicit
		success: function() {
			console.log(type+' request to server worked');
		},
		error: function(e) {
			console.log('telemetry error! look at node output...');
		}
	})
}
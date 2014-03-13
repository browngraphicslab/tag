window.onload = load;

function load() {
	initHandlers();
}

function initHandlers() {
	$('#test1').on('click', function() {
		makeRequest('testType');
	});
}

function makeRequest(type) {
	$.ajax({
		type: 'POST',
		url: 'http://127.0.0.1:8080/',
		headers: {
			telemetryType: type
		},
		success: function() {
			alert('huzzah!');
		},
		error: function(e) {
			alert('error: '+e);
		}
	})
}
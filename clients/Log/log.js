var WebSocket = require('ws');
var ws = new WebSocket(process.argv[2]);

ws.on('message', function(data, flags) {
	if (process.argv[3] === "true") {
		console.log(data, flags);
	} else {
		console.log(data);
	}
});
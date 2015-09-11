var WebSocket = require('ws');
var ws = new WebSocket(process.argv[2]);

ws.on('message', function(data, flags) {
	console.log(data, flags);
});
var rl = require('readline');

var WebSocket = require('ws');
var ws = new WebSocket(process.argv[2]);

console.log("Connecting to the server " + process.argv[2]);
var i = rl.createInterface(process.stdin, process.stdout, null);

function ask_input () {
	i.question("What should we send? ", function (data) {
		ws.send(data, {mask: true});
		setTimeout(ask_input, 0);
	});
}

ws.on("open", function () {
	console.log("Connected.");
	ask_input();
});
var WebSocketServer = require("ws").server,
    wss = new WebSocketServer({ port: 8080 });

wss.broadcast = function broadcast (data) {
	wss.clients.forEach(function sendTo (client) {
		// Send the data + silently drop all errors
		client.send(data, function ack (error) {});
	});
};

wss.on("connection", function connection (ws) {
	ws.on("message", wss.broadcast);
});
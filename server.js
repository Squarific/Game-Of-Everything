var WebSocketServer = require("ws").Server,
    wss = new WebSocketServer({ port: 8079 });

wss.broadcast = function broadcast (sender, data) {
	wss.clients.forEach(function sendTo (client) {
		if (client == sender) return;
		// Send the data + silently drop all errors
		client.send(data, function ack (error) {});
	});
};

wss.on("connection", function connection (ws) {
	ws.on("message", wss.broadcast.bind(this, ws));
});
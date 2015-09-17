function Comm (server) {
	this.server = server;
}

Comm.prototype.request = function request (path, options, callback) {
	var request = new XMLHttpRequest();

	request.addEventListener("readystatechange", function () {
		if (request.readyState == 4) callback(request);
	});

	request.open("POST", this.server + path, true);
	request.send(JSON.stringify(options));
};

// Create a client with the given moduleList
// Callback returns (err, data) err = http or parse error, data = returned by server
// data = {hash: "someClientHash"} or {error: "some error"}

Comm.prototype.createClient = function createClient (moduleList, callback) {
	this.request("/createclient", {
		moduleList: moduleList
	}, function (request) {
		if (request.status !== 200) {
			callback("HTTP Error: " + request.status);
			return;
		}

		try {
			var data = JSON.parse(request.responseText);
		} catch (e) {
			callback("Couldn't parse server response. Reponse was: " + request.responseText);
			return;
		}

		callback(null, data);
	});
};

// Create the module with the given sourcecode, name and version
// Callback (err, data) err = http or parse error, data = returned by server
// data = {error: "some error"} or {success: "some message"}

Comm.prototype.createModule = function createModule (name, version, sourceCode) {
	this.request("/createmodule", {
		name: name,
		source: sourceCode,
		version: version
	}, function (request) {
		if (request.status !== 200) {
			callback("HTTP Error: " + request.status);
			return;
		}

		try {
			var data = JSON.parse(request.responseText);
		} catch (e) {
			callback("Couldn't parse server response. Reponse was: " + request.responseText);
			return;
		}

		callback(null, data);
	});
};
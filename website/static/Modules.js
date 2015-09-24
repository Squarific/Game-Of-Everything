function Modules (server, list) {
	this.server = server;
	this.list = list;
}

Modules.prototype.load = function load () {
	for (var k = 0; k < this.list.length; k++) {
		this.loadModule(this.list[k]);
	}
};

Modules.prototype.loadModule = function loadModule (name) {
	
};
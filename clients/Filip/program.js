function Vector (x, y) {
	this.x = x;
	this.y = y;
}

Vector.prototype.add = function (vector) {
	this.x += vector.x;
	this.y += vector.y;
	return this;
};

Vector.prototype.multiply = function multiply (constant) {
	this.x *= constant;
	this.y *= constant;
	return this;
};

Vector.prototype.copy = function copy () {
	return new Vector(this.x, this.y);
};

function Player () {
	this.id = Math.random().toString(36);
	this.coords = new Vector(0, 0);
	this.speed = new Vector(0, 0);
	this.walkSpeed = 0.25;

	this.width = 50;
	this.height = 50;
}

Player.prototype.draw = function draw (ctx) {
	ctx.beginPath();
	ctx.rect(this.coords.x, this.coords.y, this.width, this.height);
	ctx.fillStyle = "black";
	ctx.fill();
};

Player.prototype.update = function update (deltaTime) {
	this.coords.add(this.speed.copy().multiply(deltaTime));
};

function Game (container) {
	this.players = [new Player()];

	this.lastUpdate = Date.now();
	this.tickTime = 10;

	this.socket = new WebSocket("ws://localhost:8080");
	this.socket.addEventListener("message", this.parseMessage.bind(this));

	this.container = container;
	this.canvas = this.container.appendChild(document.createElement("canvas"));
	this.ctx = this.canvas.getContext("2d");

	window.addEventListener("resize", this.resize.bind(this));
	document.addEventListener("keydown", this.keydown.bind(this));
	document.addEventListener("keyup", this.keyup.bind(this));

	this.resize();
	this.loop();
}

Game.prototype.parseMessage = function parseMessage (event) {
	var data;

	if (event.data instanceof Blob) {
		var reader = new FileReader();
		
		reader.addEventListener("load", function () {
			this.parseMessage({data: reader.result});
		}.bind(this));

		reader.readAsText(event.data);
		return;
	}

	try {
		data = JSON.parse(event.data);
	} catch (e) {
		return;
	}

	if (data.type == "move") {
		this.move(data);
	}

	if (data.x) {
		if (!this.specialPlayer) {
			this.specialPlayer = new Player();
		}

		this.specialPlayer.coords.x = data.x * 10 + 200;
		this.specialPlayer.coords.y = data.y * 10 + 200;
	}
};

Game.prototype.move = function move (data) {
	var found = false;
	for (var k = 0; k < this.players.length; k++) {
		if (this.players[k].id == data.id) {
			this.players[k].coords = new Vector(data.position.x, data.position.y);
			this.players[k].speed = new Vector(data.speed.x, data.speed.y);
			found = true;
		}
	}

	if (!found) {
		var key = this.players.push(new Player()) - 1;
		this.players[key].id = data.id;
		this.players[key].coords = new Vector(data.position.x, data.position.y);
		this.players[key].speed = new Vector(data.speed.x, data.speed.y);
	}
};

Game.prototype.resize = function resize () {
	this.canvas.width = this.container.offsetWidth;
	this.canvas.height = this.container.offsetHeight;
};

Game.prototype.keydown = function keydown (event) {
	var changed;

	if (event.keyCode == 37) {
		if (this.players[0].speed.x !== -this.players[0].walkSpeed) {
			this.players[0].speed.x = -this.players[0].walkSpeed;
			changed = true;
		}
	}

	if (event.keyCode == 38) {
		if (this.players[0].speed.y !== -this.players[0].walkSpeed) {
			this.players[0].speed.y = -this.players[0].walkSpeed;
			changed = true;
		}
	}

	if (event.keyCode == 39) {
		if (this.players[0].speed.x !== this.players[0].walkSpeed) {
			this.players[0].speed.x = this.players[0].walkSpeed;
			changed = true;
		}
	}

	if (event.keyCode == 40) {
		if (this.players[0].speed.y !== this.players[0].walkSpeed) {
			this.players[0].speed.y = this.players[0].walkSpeed;
			changed = true;
		}
	}

	if (changed) {
		this.socket.send(JSON.stringify({
			type: "move",
			id: this.players[0].id,
			position: this.players[0].coords,
			speed: this.players[0].speed
		}));
	}
};

Game.prototype.keyup = function keyup (event) {
	if (event.keyCode == 37) {
		this.players[0].speed.x = 0;
	}

	if (event.keyCode == 38) {
		this.players[0].speed.y = 0;
	}

	if (event.keyCode == 39) {
		this.players[0].speed.x = 0;
	}

	if (event.keyCode == 40) {
		this.players[0].speed.y = 0;
	}

	this.socket.send(JSON.stringify({
		type: "move",
		id: this.players[0].id,
		position: this.players[0].coords,
		speed: this.players[0].speed
	}));
};

Game.prototype.update = function update (deltaTime) {
	for (var k = 0; k < this.players.length; k++) {
		this.players[k].update(deltaTime);
	}
};

Game.prototype.draw = function draw () {
	this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

	for (var k = 0; k < this.players.length; k++) {
		this.players[k].draw(this.ctx);
	}

	if (this.specialPlayer)
		this.specialPlayer.draw(this.ctx);
};

Game.prototype.loop = function loop () {
	var elapsedTime = Date.now() - this.lastUpdate;

	while (elapsedTime > this.tickTime) {
		this.update(this.tickTime);
		elapsedTime -= this.tickTime;
		this.lastUpdate += this.tickTime;
	}

	this.draw();
	requestAnimationFrame(this.loop.bind(this));
};
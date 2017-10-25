//Router.js
let PMap = require('./pMap.js');
console.log(PMap);

function Router(hashMapImplementation){
	this.MAX_PORTS = 10000;
	const activeConnections = new hashMapImplementation(this.MAX_PORTS*1.25)

	this.connect = (connection) => {
		if (activeConnections.length < this.MAX_PORTS)
			activeConnections.insert(connection.ip, connection);

		console.log('Connect:', connection.ip);
	};

	this.disconnect = (connection) => {
		activeConnections.delete(connection);
		console.log('Disconnect:', connection.ip)
	};

	this.traffic = (connection) => {
		activeConnections.search(connection);
		console.log('Traffic:', connection.ip)
	};
}

function Generator(target) {
	this.connections = new Array(target.MAX_PORTS*2);
	this.target = target;

	const CONNECT_RATE = 150;
	const TRAFFIC_RATE = 50
	const TIMEOUT = 5000;
	let lastCheck = 0;

	let trafficTimer = 0;
	let connectTimer = 0;

	const delta = () => {
		const delta = Date.now() - lastCheck;
		lastCheck = Date.now();
		return delta;
	};

	let makeFakeIps = () => {
		return getRandomInt(0,1000000);
	}

	let makeSemiRandomData = () => {
		const rando = getRandomInt(0,3);
		let TTD; 

		if (rando == 0){
			TTD = Date.now() + getRandomInt(1.8e+6, 8.64e+7); //Live 30 minute - 1 day
		} else {
			TTD = Date.now() + getRandomInt(500, 10000);
		}

		return {
			dead: false,
			timeToDisconnect: TTD
		};
	}

	function shouldDisconnect(connection){
		return (Date.now() > connection.data.timeToDisconnect);
	}

	const shouldDie = (connection) => {
		return (Date.now() > connection.data.timeToDisconnect + TIMEOUT);
	}

	this.newConnection = function() {
		const newConnect = {};
		newConnect.ip = makeFakeIps();
		newConnect.data = makeSemiRandomData();
		target.connect(newConnect);

		let i;
		do {
			// console.log("try rando")
			i = getRandomInt(0, this.connections.length)
		} while(this.connections[i] != undefined && this.connections[i].data.dead == false)

		this.connections[i]=newConnect;
	};

	this.traffic = function() {
		let connection;
		do {
			console.log("try traffic");
			connection = this.connections[getRandomInt(0, this.connections.length)]
		} while (connection == undefined || connection.data.dead == true)
				

		target.traffic(connection);

		//If connection is too old, disconnect		
		if (connection.connected && shouldDisconnect(connection))
			target.disconnect(connection);

		if (shouldDie(connection))
			connection.data.dead = true
	};

	this.run = () => {
		while (true){
			const thisDelta = delta();
			connectTimer += thisDelta;
			trafficTimer += thisDelta;

			if (connectTimer > CONNECT_RATE){
				this.newConnection();
			}

			if (trafficTimer > TRAFFIC_RATE){
				this.traffic();
			}


			//simulate
		}
	}
}

const router = new Router(PMap);
const generator = new Generator(router);
generator.run();




function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}



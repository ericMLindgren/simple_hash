//Router.js
let PMap = require('./pMap.js');
console.log(PMap);

function Router(hashMapImplementation){
	this.MAX_PORTS = 10000;
	const activeConnections = new hashMapImplementation(parseInt(this.MAX_PORTS*1.25))

	this.connect = (connection) => {
		if (activeConnections.capacityInUse < this.MAX_PORTS)
			activeConnections.insert(connection.ip, connection);

		console.log('<Router> Connect:', connection.ip);
	};

	this.disconnect = (connection) => {
		activeConnections.delete(connection.ip);
		console.log('<Router> Disconnect:', connection.ip)
	};

	this.traffic = (connection) => {
		activeConnections.search(connection.ip);
		console.log('<Router> Traffic:', connection.ip)
	};
}

function Generator(target) {
	//dynamically expand initially and then switch to random once populated?
	this.connections = [];
	this.target = target;

	const MAX_CONNECTIONS = target.MAX_PORTS*2
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

	const makeFakeIps = () => {
		return getRandomInt(0,1000000);
	}

	const makeSemiRandomData = () => {
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

	const getRandomConnection = () => {

	}

	const shouldDisconnect = (connection) => {
		return (Date.now() > connection.metadata.timeToDisconnect);
	}

	const shouldDie = (connection) => {
		return (Date.now() > connection.metadata.timeToDisconnect + TIMEOUT);
	}

	this.newConnection = function() {
		const newConnect = {};
		newConnect.ip = makeFakeIps();
		newConnect.metadata = makeSemiRandomData();
		target.connect(newConnect);

		let i;
		if (this.connections.length > MAX_CONNECTIONS-1){
			do {
				console.log("Generator at MAX_CONNECTIONS, probing for dead spots")
				i = getRandomInt(0, MAX_CONNECTIONS);
			} while(this.connections[i].metadata.dead == false)

			this.connections[i]=newConnect;
		}
		else {
			console.log('At:', this.connections.length, ' of max: ', MAX_CONNECTIONS)
			this.connections.push(newConnect);
		}
		connectTimer = 0;
	};

	this.traffic = function() {
		let connection;
		do {
			console.log("try traffic");
			connection = this.connections[getRandomInt(0, this.connections.length)]
		} while (connection == undefined || connection.metadata.dead == true)

		target.traffic(connection);

		//If connection is too old, disconnect		
		if (shouldDisconnect(connection)) {
			console.log('Connection:',connection.ip,'has expired, disconnecting.')
			target.disconnect(connection);
		}

		if (shouldDie(connection))
			connection.metadata.dead = true

		trafficTimer = 0;
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



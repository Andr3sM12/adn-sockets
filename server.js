console.clear();

const { Server } = require("net");

const host = "0.0.0.0";

const EXIT = "EXIT";

const connections = new Map();

const error = (message) => {
	console.error(message);
	process.exit(1);
};

const sendMessage = (message, origin) => {
	for (const socket of connections.keys()) {
		if (socket !== origin) {
			socket.write(message);
		}
	}
};

const listen = (port) => {
	const server = new Server();
	server.on("connection", (socket) => {
		const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
		console.log(`Nueva conexion desde: ${remoteSocket}`);
		socket.setEncoding("utf-8");

		socket.on("data", (message) => {
			if (!connections.has(socket)) {
				console.log(`${message} Conectado desde: ${remoteSocket}`);
				connections.set(socket, message);
			} else if (message === EXIT) {
				console.log(`Conexion con: ${remoteSocket} se ha finalizado`);
				socket.end();
				connections.delete(socket);
			} else {
				const fullMessage = `[${connections.get(socket)}]: ${message}`;
				console.log(`${remoteSocket} -> ${fullMessage}`);
				sendMessage(fullMessage, socket);
			}
		});

		socket.on("error", (err) => error(err.messagemessage));
	});

	server.listen({ port, host }, () => {
		console.log(`Server abierto en puerto: ${port}`);
	});
	server.on("error", (err) => error(err.message));
};

const main = () => {
	if (process.argv.length !== 3) {
		error(`Usage: node ${__filename} port`);
	}

	let port = process.argv[2];
	if (isNaN(port)) {
		error(`Puerto invalido: ${port}`);
	}

	port = Number(port);
	listen(port);
};

if (require.main === module) {
	main();
}

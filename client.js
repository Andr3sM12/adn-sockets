console.clear();

const { Socket } = require("net");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

const EXIT = "EXIT";

const error = (message) => {
	console.error(message);
	process.exit(1);
};

const connect = (host, port) => {
	console.log(`Conectando con: ${host}:${port}`);

	const socket = new Socket();
	socket.connect({ host, port });
	socket.setEncoding("utf-8");

	socket.on("connect", () => {
		console.log("Conectado");

		readline.question("Escoge tu nombre de usuario: ", (username) => {
			socket.write(username);
			console.log(`Escribe cualquier mensaje, Escribe ${EXIT} para finalizar`);
		});

		readline.on("line", (message) => {
			socket.write(message);
			if (message === EXIT) {
				socket.end();
			}
		});
		socket.on("data", (data) => {
			console.log(data);
		});
	});

	socket.on("error", (err) => error(err.message));

	socket.on("close", () => {
		console.log("Desconectado");
		process.exit(0);
	});
};

const main = () => {
	if (process.argv.length !== 4) {
		error(`Uso; node ${__filename} host port`);
	}
	let [, , host, port] = process.argv;
	if (isNaN(port)) {
		error(`Puerto invalido ${port}`);
	}
	port = Number(port);

	connect(host, port);
};
if (module === require.main) {
	main();
}

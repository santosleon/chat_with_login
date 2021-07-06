const express = require("express");
const expressWs = require("express-ws");
const cors = require("cors");
const cookieparser = require('cookie-parser');
const app = express();
const db = require("./database/database.js");
const prepareUserRoutes = require("./database/routes/userRoutes");

expressWs(app);
const connections = new Set();

app.ws('/chat', (ws) => {
	connections.add(ws);
	ws.on('message', (data) => {
		const { room, username, message } = JSON.parse(data);
		if (room !== undefined && username !== undefined && message !== undefined) {
			const Message = db.message;
			(new Message({ room, username, message }))
				.save()
				.then(() => {
					connections.forEach((client) => {
						if (client !== ws && client.readyState === 1 /*WebSocket.OPEN*/) {
							client.send(data);
						}
					});
				})
				.catch((error) => console.log(error));
		}
	})
	ws.on('close', () => {
		connections.delete(ws);
	})
});

var corsOptions = {
	origin: "http://localhost:8081",
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
	allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieparser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.mongoose
	.connect(db.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch(err => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});

prepareUserRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});

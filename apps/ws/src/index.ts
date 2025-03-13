import { Server } from "socket.io";

const PORT = 5505;

const io = new Server(PORT);

io.on("connection", (socket) => {
	console.log("New user connected:", socket.id);

	// Listen for cursor updates
	socket.on("cursorMove", (data) => {
		socket.broadcast.emit("cursorMove", data); // Broadcast to other users
	});

	// Listen for drawing data
	socket.on("drawing", (data) => {
		socket.broadcast.emit("drawing", data); // Broadcast drawing changes to others
	});

	// Handle disconnection
	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
	});
});

console.log(`Web Socket server running on port ${PORT}`);

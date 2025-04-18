import { logger } from "@workspace/common";
import { WebSocketServer } from "ws";

const PORT = 5502;

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
	logger.info("New user connected:");

	ws.on("message", (message) => {
		logger.info("Received message:", message);
	});

	ws.on("close", () => {
		logger.info("User disconnected");
	});
});

wss.on("error", (error) => {
	logger.error("WebSocket error:", error);
});

logger.info("🔥 Web Socket is live!", { port: PORT });

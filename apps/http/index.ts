import { logger } from "@workspace/common";
import { createServer } from "./app";

const PORT = 5501;
const server = createServer();

server.listen(PORT, () => {
	logger.info("🔥 API is live!", { port: PORT });
});

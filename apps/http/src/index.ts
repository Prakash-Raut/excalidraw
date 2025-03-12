import { Config, logger } from "@workspace/common";
import app from "./app";

const startServer = async () => {
	const PORT = Config.PORT;
	try {
		logger.info("Database connected successfully");
		app.listen(PORT, () => {
			logger.info("Server listening on port", { port: PORT });
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			logger.error(err.message);
			setTimeout(() => {
				process.exit(1);
			}, 1000);
		}
	}
};

void startServer();

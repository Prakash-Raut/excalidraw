import winston from "winston";
import { appConfig } from "..";

export const logger = winston.createLogger({
	level: "info",
	defaultMeta: {
		serviceName: "http-backend",
	},
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json(),
	),
	transports: [
		new winston.transports.File({
			dirname: "logs",
			filename: "combined.log",
			level: "info",
			silent: appConfig.env === "test",
		}),

		new winston.transports.File({
			dirname: "logs",
			filename: "error.log",
			level: "error",
			silent: appConfig.env === "test",
		}),

		new winston.transports.Console({
			level: "info",
			silent: appConfig.env === "test",
		}),
	],
});

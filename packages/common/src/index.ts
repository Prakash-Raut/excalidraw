import config from "config";

export const appConfig = {
	port: config.get<number>("app.port"),
	env: config.get<string>("app.env"),
};

export const securityConfig = {
	saltRounds: config.get<number>("security.saltRounds"),
	refreshTokenSecret: config.get<string>("security.refreshTokenSecret"),
	jwtKeyId: config.get<string>("security.jwtKeyId"),
};

export const jwtConfig = {
	jwksUri: config.get<string>("jwt.jwksUri"),
};

export const domainConfig = {
	main: config.get<string>("domains.main"),
	clientUi: config.get<string>("domains.clientUi"),
};

// Debugging: Print Config
console.log("App Config:", appConfig);
console.log("Security Config:", securityConfig);
console.log("JWT Config:", jwtConfig);
console.log("Domain Config:", domainConfig);

// Re-exporting dependencies & modules
export * from "jsonwebtoken";
export { Logger } from "winston";
export * from "zod";

// Exporting internal modules
export * from "./config/logger";
export * from "./middleware/authenticate";
export * from "./middleware/globalErrorHandler";
export * from "./types";
export * from "./validators/create-user-validator";
export * from "./validators/list-user-validator";
export * from "./validators/login-validator";
export * from "./validators/register-validator";
export * from "./validators/update-user-validator";
export * from "./validators/validate";

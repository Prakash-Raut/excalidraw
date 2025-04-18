import "@workspace/common";
import { globalErrorHandler } from "@workspace/common";
import cors from "cors";
import type { Express, NextFunction, Request, Response } from "express";
import express from "express";
import morgan from "morgan";
import { roomRouter } from "./routes/room";
import { userRouter } from "./routes/user";

const ALLOWED_DOMAINS: string[] = [process.env.CLIENT_UI as string];

export const createServer = (): Express => {
	const app = express();
	app
		.disable("x-powered-by")
		.use(morgan("dev"))
		.use(express.urlencoded({ extended: true }))
		.use(express.json())
		.use(cors({ origin: ALLOWED_DOMAINS, credentials: true }))
		.get("/", (req: Request, res: Response, next: NextFunction) => {
			res.json({ status: "success", message: "OK" });
		})
		.use("/users", userRouter)
		.use("/rooms", roomRouter)
		.use(globalErrorHandler);
	return app;
};

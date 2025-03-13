import "@workspace/common";
import { domainConfig, globalErrorHandler } from "@workspace/common";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import roomRouter from "./routes/room";

const app: Express = express();

const ALLOWED_DOMAINS: string[] = [domainConfig.clientUi];

app
	.use(cors({ origin: ALLOWED_DOMAINS, credentials: true }))
	.use(express.static("public"))
	.use(express.json())
	.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.use("/rooms", roomRouter);

app.use(globalErrorHandler);

export default app;

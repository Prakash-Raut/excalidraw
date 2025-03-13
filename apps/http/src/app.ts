import "@workspace/common";
import { domainConfig, globalErrorHandler } from "@workspace/common";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import roomRouter from "./routes/room";
import userRouter from "./routes/user";

const app: Express = express();

const ALLOWED_DOMAINS: string[] = [domainConfig.clientUi];

app
	.use(cors({ origin: ALLOWED_DOMAINS, credentials: true }))
	.use(express.static("public"))
	.use(cookieParser())
	.use(express.json())
	.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/chats", chatRouter);

app.use(globalErrorHandler);

export default app;

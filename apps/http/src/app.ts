import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import { Config } from "./config/env";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";

const app: Express = express();

const ALLOWED_DOMAINS: string[] = [
	Config.CLIENT_UI_DOMAIN as string,
	Config.ADMIN_UI_DOMAIN as string,
];

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

app.use(globalErrorHandler);

export default app;

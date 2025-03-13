import { logger } from "@workspace/common";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { ChatController } from "../controllers/ChatController";
import { ChatService } from "../services/ChatService";

const router = Router();

const chatService = new ChatService();
const chatController = new ChatController(chatService, logger);

router.get(
	"/:roomId",
	async (req: Request, res: Response, next: NextFunction) => {
		await chatController.getAll(req, res, next);
	},
);

export default router;

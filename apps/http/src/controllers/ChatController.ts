import type { Logger } from "@workspace/common";
import type { NextFunction, Request, Response } from "express";
import type { ChatService } from "../services/ChatService";

export class ChatController {
	constructor(
		private chatService: ChatService,
		private logger: Logger,
	) {}

	getAll = async (req: Request, res: Response, next: NextFunction) => {
		const { roomId } = req.params;

		this.logger.debug("Request for fetching all chats");

		try {
			const chats = await this.chatService.getAll(Number(roomId));

			this.logger.info("Chats have been fetched");

			res.status(200).json(chats);
		} catch (error) {
			next(error);
		}
	};
}

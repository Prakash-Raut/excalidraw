import type { Logger } from "@workspace/common";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { RoomService } from "../services/RoomService";

export class RoomController {
	constructor(
		private roomService: RoomService,
		private logger: Logger,
	) {}

	create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const room = await this.roomService.create();

			this.logger.info("Room has been created", { id: room.id });

			res.status(201).json({ id: room.id });
		} catch (error) {
			next(error);
		}
	};

	join = async (req: Request, res: Response, next: NextFunction) => {
		const { roomId } = req.params;

		this.logger.debug("Request for fetching a room", { roomId });

		try {
			const room = await this.roomService.join(roomId);

			if (!room) {
				return next(createHttpError(404, "Room not found"));
			}

			this.logger.info("Room has been fetched", { roomId });

			res.status(200).json({ id: room.id, elements: room.elements });
		} catch (error) {
			next(error);
		}
	};

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const { roomId } = req.params;

		this.logger.debug("Request for deleting a room", { roomId });

		try {
			const room = await this.roomService.delete(roomId);

			this.logger.info("Room has been deleted", { roomId });

			res.status(204).json({ message: "Room has been deleted", id: room.id });
		} catch (error) {
			next(error);
		}
	};
}

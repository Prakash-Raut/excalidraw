import type { AuthRequest, Logger } from "@workspace/common";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { RoomService } from "../services/RoomService";

export class RoomController {
	constructor(
		private roomService: RoomService,
		private logger: Logger,
	) {}

	create = async (req: AuthRequest, res: Response, next: NextFunction) => {
		const { id: userId } = req.auth;

		if (!userId) {
			return next(createHttpError(401, "Unauthorized"));
		}

		this.logger.debug("Request for creating a room", req.body);

		try {
			const room = await this.roomService.create({
				ownerId: userId,
			});

			this.logger.info("Room has been created", { id: room.id });

			res.status(201).json({ id: room.id });
		} catch (error) {
			next(error);
		}
	};

	getOne = async (req: Request, res: Response, next: NextFunction) => {
		const { id: roomId } = req.params;

		this.logger.debug("Request for fetching a room", { roomId });

		try {
			const room = await this.roomService.getOne(Number(roomId));

			if (!room) {
				return next(createHttpError(404, "Room not found"));
			}

			this.logger.info("Room has been fetched", { roomId });

			res.status(200).json(room);
		} catch (error) {
			next(error);
		}
	};

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const { id: roomId } = req.params;

		this.logger.debug("Request for deleting a room", { roomId });

		try {
			await this.roomService.delete(Number(roomId));

			this.logger.info("Room has been deleted", { roomId });

			res.status(204).json({ message: "Room has been deleted", roomId });
		} catch (error) {
			next(error);
		}
	};
}

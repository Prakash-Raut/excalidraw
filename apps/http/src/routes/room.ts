import { authenticate, logger } from "@workspace/common";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { RoomController } from "../controllers/RoomController";
import { RoomService } from "../services/RoomService";

const router = Router();

const roomService = new RoomService();
const roomController = new RoomController(roomService, logger);

router.post(
	"/",
	authenticate,
	(req: Request, res: Response, next: NextFunction) =>
		roomController.create(req, res, next),
);

router.get(
	"/:id",
	authenticate,
	(req: Request, res: Response, next: NextFunction) =>
		roomController.getOne(req, res, next),
);

router.delete(
	"/:id",
	authenticate,
	(req: Request, res: Response, next: NextFunction) =>
		roomController.delete(req, res, next),
);

export default router;

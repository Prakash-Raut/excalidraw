import { logger } from "@workspace/common";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { RoomController } from "../controllers/RoomController";
import { RoomService } from "../services/RoomService";

const router = Router();

const roomService = new RoomService();
const roomController = new RoomController(roomService, logger);

router.post("/", (req: Request, res: Response, next: NextFunction) =>
	roomController.create(req, res, next),
);

router.get("/:roomId", (req: Request, res: Response, next: NextFunction) =>
	roomController.join(req, res, next),
);

router.delete("/:roomId", (req: Request, res: Response, next: NextFunction) =>
	roomController.delete(req, res, next),
);

export default router;

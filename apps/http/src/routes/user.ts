import { prisma } from "@workspace/database";
import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import logger from "../config/logger";
import { Roles } from "../constants";
import { UserController } from "../controllers/UserController";
import authenticate from "../middleware/authenticate";
import { UserService } from "../services/UserService";
import type { CreateUserRequest, UpdateUserRequest } from "../types";
import createUserValidator from "../validators/create-user-validator";
import listUserValidator from "../validators/list-user-validator";
import updateUserValidator from "../validators/update-user-validator";

const router = Router();

const userService = new UserService(prisma);
const userController = new UserController(userService, logger);

router.post(
	"/",
	authenticate,
	createUserValidator,
	(req: CreateUserRequest, res: Response, next: NextFunction) =>
		userController.create(req, res, next),
);

router.get(
	"/",
	authenticate,
	listUserValidator,
	(req: Request, res: Response, next: NextFunction) =>
		userController.getAll(req, res, next),
);

router.get(
	"/:id",
	authenticate,
	(req: Request, res: Response, next: NextFunction) =>
		userController.getOne(req, res, next),
);

router.patch(
	"/:id",
	authenticate,
	updateUserValidator,
	(req: UpdateUserRequest, res: Response, next: NextFunction) =>
		userController.update(req, res, next),
);

router.delete(
	"/:id",
	authenticate,
	(req: Request, res: Response, next: NextFunction) =>
		userController.destroy(req, res, next),
);

export default router;

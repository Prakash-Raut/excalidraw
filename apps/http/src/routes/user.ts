import {
	type CreateUserRequest,
	type UpdateUserRequest,
	authenticate,
	createUserSchema,
	logger,
	querySchema,
	updateUserSchema,
	validateRequest,
} from "@workspace/common";
import { prisma } from "@workspace/database";
import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";

const router = Router();

const userService = new UserService(prisma);
const userController = new UserController(userService, logger);

router.post(
	"/",
	authenticate,
	validateRequest(createUserSchema),
	(req: CreateUserRequest, res: Response, next: NextFunction) =>
		userController.create(req, res, next),
);

router.get(
	"/",
	authenticate,
	validateRequest(querySchema),
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
	validateRequest(updateUserSchema),
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

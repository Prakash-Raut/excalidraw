import type { AuthRequest } from "@workspace/common";
import {
	authenticate,
	logger,
	loginUserSchema,
	registerUserSchema,
	validateRequest,
} from "@workspace/common";
import { prisma } from "@workspace/database";
import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import { AuthController } from "../controllers/AuthController";
import { parseRefreshToken } from "../middleware/parseRefreshToken";
import { validateRefreshToken } from "../middleware/validateRefreshToken";
import { CredentialService } from "../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";

const router: Router = Router();

const userService = new UserService(prisma);
const tokenService = new TokenService(prisma);
const credentialService = new CredentialService();
const authController = new AuthController(
	userService,
	logger,
	tokenService,
	credentialService,
);

router.post(
	"/register",
	validateRequest(registerUserSchema),
	async (req: Request, res: Response, next: NextFunction) => {
		await authController.register(req, res, next);
	},
);

router.post(
	"/login",
	validateRequest(loginUserSchema),
	async (req: Request, res: Response, next: NextFunction) => {
		await authController.login(req, res, next);
	},
);

router.get(
	"/self",
	authenticate,
	async (req: Request, res: Response, next: NextFunction) => {
		await authController.self(req as AuthRequest, res, next);
	},
);

router.post(
	"/refresh",
	validateRefreshToken,
	async (req: Request, res: Response, next: NextFunction) => {
		await authController.refresh(req as AuthRequest, res, next);
	},
);

router.post(
	"/logout",
	authenticate,
	parseRefreshToken,
	async (req: Request, res: Response, next: NextFunction) => {
		await authController.logout(req as AuthRequest, res, next);
	},
);

export default router;

import { prisma } from "@workspace/database";
import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import logger from "../config/logger";
import { AuthController } from "../controllers/AuthController";
import authenticate from "../middleware/authenticate";
import parseRefreshToken from "../middleware/parseRefreshToken";
import validateRefreshToken from "../middleware/validateRefreshToken";
import { CredentialService } from "../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import type { AuthRequest } from "../types";
import loginValidator from "../validators/login-validator";
import registerValidator from "../validators/register-validator";

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
	registerValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		await authController.register(req, res, next);
	},
);

router.post(
	"/login",
	loginValidator,
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

router.get(
	"/google",
	async (req: Request, res: Response, next: NextFunction) => {
		await authController.initiateGoogleOAuth(req, res, next);
	},
);

router.get(
	"/google/callback",
	async (req: Request, res: Response, next: NextFunction) => {
		await authController.handleGoogleOAuthCallback(req, res, next);
	},
);

export default router;

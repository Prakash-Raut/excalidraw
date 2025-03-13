import {
	type AuthRequest,
	type Logger,
	type RegisterUserRequest,
	domainConfig,
} from "@workspace/common";
import type { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import type { JwtPayload } from "jsonwebtoken";
import type { CredentialService } from "../services/CredentialService";
import type { TokenService } from "../services/TokenService";
import type { UserService } from "../services/UserService";

export class AuthController {
	constructor(
		private userService: UserService,
		private logger: Logger,
		private tokenService: TokenService,
		private credentialService: CredentialService,
	) {}

	register = async (
		req: RegisterUserRequest,
		res: Response,
		next: NextFunction,
	) => {
		const { firstName, lastName, email, password } = req.body;

		this.logger.debug("New Request to register user", {
			firstName,
			lastName,
			email,
			password: "******",
		});

		if (!email) {
			const err = createHttpError(400, "Email is required");
			return next(err);
		}

		try {
			const user = await this.userService.create({
				firstName,
				lastName,
				email,
				password,
			});
			this.logger.info("User has been registered", { id: user.id });

			const payload: JwtPayload = {
				sub: String(user.id),
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			};

			const accessToken = this.tokenService.generateAccessToken(payload);

			const newRefreshToken = await this.tokenService.persistRefreshToken(user);

			const refreshToken = this.tokenService.generateRefreshToken({
				...payload,
				id: newRefreshToken.id,
			});

			res.cookie("accessToken", accessToken, {
				domain: domainConfig.main,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
				httpOnly: true,
			});

			res.cookie("refreshToken", refreshToken, {
				domain: domainConfig.main,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 365,
				httpOnly: true,
			});

			res.status(201).json({ id: user.id });
		} catch (error) {
			next(error);
		}
	};

	login = async (
		req: RegisterUserRequest,
		res: Response,
		next: NextFunction,
	) => {
		const { email, password } = req.body;

		this.logger.debug("New Request to login user", {
			email,
			password: "******",
		});

		if (!email) {
			return next(createHttpError(400, "Email is required"));
		}

		try {
			const user = await this.userService.findByEmailWithPassword(email);

			if (!user) {
				return next(createHttpError(400, "Email or password does not match"));
			}

			const isPasswordValid = await this.credentialService.comparePassword(
				password,
				user.password,
			);

			if (!isPasswordValid) {
				return next(createHttpError(400, "Email or password does not match"));
			}

			const payload: JwtPayload = {
				sub: String(user.id),
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			};

			const accessToken = this.tokenService.generateAccessToken(payload);

			const newRefreshToken = await this.tokenService.persistRefreshToken(user);

			const refreshToken = this.tokenService.generateRefreshToken({
				...payload,
				id: newRefreshToken.id,
			});

			res.cookie("accessToken", accessToken, {
				domain: domainConfig.main,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
				httpOnly: true,
			});

			res.cookie("refreshToken", refreshToken, {
				domain: domainConfig.main,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 365,
				httpOnly: true,
			});

			this.logger.info("User has been logged in", { id: user.id });
			res.status(200).json({ id: user.id });
		} catch (error) {
			next(error);
		}
	};

	self = async (req: AuthRequest, res: Response, next: NextFunction) => {
		const userId = req.auth?.id;

		if (!userId || Number.isNaN(Number(userId))) {
			return next(createHttpError(400, "Invalid user ID in token"));
		}

		try {
			const user = await this.userService.findById(Number(userId));

			if (!user) {
				return next(createHttpError(400, "User not found"));
			}

			res.status(200).json({ ...user, password: undefined });
		} catch (error) {
			next(error);
		}
	};

	refresh = async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const payload: JwtPayload = {
				sub: req.auth.sub,
				firstName: req.auth.firstName,
				lastName: req.auth.lastName,
				email: req.auth.email,
			};

			const accessToken = this.tokenService.generateAccessToken(payload);

			const user = await this.userService.findById(Number(req.auth.sub));

			if (!user) {
				const err = createHttpError(400, "User with token not found");
				return next(err);
			}

			const newRefreshToken = await this.tokenService.persistRefreshToken(user);

			await this.tokenService.deleteRefreshToken(Number(req.auth.id));

			const refreshToken = this.tokenService.generateRefreshToken({
				...payload,
				id: newRefreshToken.id,
			});

			res.cookie("accessToken", accessToken, {
				domain: domainConfig.main,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
				httpOnly: true,
			});

			res.cookie("refreshToken", refreshToken, {
				domain: domainConfig.main,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 365,
				httpOnly: true,
			});

			this.logger.info("User has been logged in", { id: user.id });
			res.status(200).json({ id: user.id });
		} catch (error) {
			next(error);
		}
	};

	logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			await this.tokenService.deleteRefreshToken(Number(req.auth.id));

			this.logger.info("Refresh token has been deleted", {
				id: req.auth.id,
			});

			this.logger.info("User has been logged out", { id: req.auth.sub });

			res.clearCookie("accessToken", { domain: "localhost" });
			res.clearCookie("refreshToken", { domain: "localhost" });

			res.status(200).json({});
		} catch (error) {
			next(error);
		}
	};
}

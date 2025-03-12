import { loginUserSchema, registerUserSchema } from "@workspace/common";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { JwtPayload } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import type { Logger } from "winston";
import { Config } from "../config/env";
import { GOOGLE_OAUTH_SCOPES } from "../constants";
import type { CredentialService } from "../services/CredentialService";
import type { TokenService } from "../services/TokenService";
import type { UserService } from "../services/UserService";
import type { AuthRequest, RegisterUserRequest } from "../types";

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
		const { error, data, success } = registerUserSchema.safeParse(req.body);

		if (!success) {
			return next(createHttpError(400, error.message));
		}

		const { firstName, lastName, email, password } = data;

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
				domain: Config.MAIN_DOMAIN,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
				httpOnly: true,
			});

			res.cookie("refreshToken", refreshToken, {
				domain: Config.MAIN_DOMAIN,
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
		const { error, data, success } = loginUserSchema.safeParse(req.body);

		if (!success) {
			return next(createHttpError(400, error.message));
		}

		const { email, password } = data;

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
				domain: Config.MAIN_DOMAIN,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
				httpOnly: true,
			});

			res.cookie("refreshToken", refreshToken, {
				domain: Config.MAIN_DOMAIN,
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
				domain: Config.MAIN_DOMAIN,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
				httpOnly: true,
			});

			res.cookie("refreshToken", refreshToken, {
				domain: Config.MAIN_DOMAIN,
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

	initiateGoogleOAuth = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const state = uuid();

			res.cookie("oauth_state", state, {
				httpOnly: true,
				secure: Config.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 1000 * 60 * 10, // 10 minutes expiry
			});

			console.log("Stored State:", req.cookies.oauth_state);

			const scopes = GOOGLE_OAUTH_SCOPES.join(" ");

			if (!Config.GOOGLE_OAUTH_URL) {
				throw new Error("GOOGLE_OAUTH_URL is not defined");
			}

			if (!Config.GOOGLE_CLIENT_ID) {
				throw new Error("GOOGLE_CLIENT_ID is not defined");
			}

			if (!Config.GOOGLE_CALLBACK_URL) {
				throw new Error("GOOGLE_CALLBACK_URL is not defined");
			}

			const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${Config.GOOGLE_OAUTH_URL}?client_id=${Config.GOOGLE_CLIENT_ID}&redirect_uri=${Config.GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;

			this.logger.info("Redirecting to Google OAuth consent screen");

			res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
		} catch (error) {
			next(error);
		}
	};

	handleGoogleOAuthCallback = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			console.log(req.query);

			const { code, state } = req.query;

			const storedState = req.cookies.oauth_state;

			if (!state || state !== storedState) {
				return next(createHttpError(403, "Invalid OAuth state"));
			}

			res.clearCookie("oauth_state");

			if (!Config.GOOGLE_ACCESS_TOKEN_URL) {
				throw new Error("GOOGLE_ACCESS_TOKEN_URL is not defined");
			}

			this.logger.info("Requesting Google Access Token");

			const response = await fetch(Config.GOOGLE_ACCESS_TOKEN_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					code: code as string,
					client_id: Config.GOOGLE_CLIENT_ID as string,
					client_secret: Config.GOOGLE_CLIENT_SECRET as string,
					redirect_uri: Config.GOOGLE_CALLBACK_URL as string,
					grant_type: "authorization_code",
				}).toString(),
			});

			const access_token_data = await response.json();

			const { id_token } = access_token_data;

			if (!id_token) {
				return next(createHttpError(400, "Missing Google ID Token"));
			}

			const tokenInfoResponse = await fetch(
				`${Config.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`,
			);

			const userInfo = await tokenInfoResponse.json();

			const user = await this.userService.create({
				firstName: userInfo.given_name,
				lastName: userInfo.family_name,
				email: userInfo.email,
				password: "",
			});

			this.logger.info("User has been registered", { id: user.id });

			const accessToken = this.tokenService.generateAccessToken(user);
			const refreshToken = this.tokenService.generateRefreshToken(user);

			res.cookie("accessToken", accessToken, {
				domain: Config.MAIN_DOMAIN,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60,
				httpOnly: true,
			});

			res.cookie("refreshToken", refreshToken, {
				domain: Config.MAIN_DOMAIN,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 365,
				httpOnly: true,
			});

			this.logger.info("User has been logged in", { id: user.id });

			if (!Config.CLIENT_UI_DOMAIN) {
				throw new Error("CLIENT_UI_DOMAIN is not defined");
			}

			res.redirect(Config.CLIENT_UI_DOMAIN);
		} catch (error) {
			next(error);
		}
	};
}

import { prisma } from "@workspace/database";
import type { Request } from "express";
import { expressjwt } from "express-jwt";
import { Config } from "../config/env";
import logger from "../config/logger";
import type { AuthCookie, IRefreshTokenPayload } from "../types";

export default expressjwt({
	secret: Config.REFRESH_TOKEN_SECRET as string,
	algorithms: ["HS256"],
	getToken: (req: Request) => {
		const { refreshToken } = req.cookies as AuthCookie;
		return refreshToken;
	},
	async isRevoked(req: Request, token) {
		try {
			if (!token) return true;
			const tokenPayload = token?.payload as IRefreshTokenPayload;
			if (!tokenPayload?.id || !tokenPayload?.sub) {
				logger.error("Token payload is missing required fields", {
					tokenPayload,
				});
				return true;
			}
			const refreshToken = await prisma.refreshToken.findUnique({
				where: {
					id: Number(tokenPayload.id),
				},
				include: {
					user: true,
				},
			});
			if (!refreshToken) {
				logger.warn("Refresh token not found in DB", { tokenPayload });
				return true;
			}
			return false; // Token is valid
		} catch (error) {
			logger.error("Error while verifying refresh token");
		}
		return true;
	},
});

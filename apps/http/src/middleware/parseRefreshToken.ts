import { type AuthCookie, securityConfig } from "@workspace/common";
import type { Request } from "express";
import { expressjwt } from "express-jwt";

export const parseRefreshToken = expressjwt({
	secret: securityConfig.refreshTokenSecret,
	algorithms: ["HS256"],
	getToken: (req: Request) => {
		const { refreshToken } = req.cookies as AuthCookie;
		return refreshToken;
	},
});

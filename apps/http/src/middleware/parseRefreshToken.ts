import type { AuthCookie } from "@workspace/common";
import { Config } from "@workspace/common";
import type { Request } from "express";
import { expressjwt } from "express-jwt";

export const parseRefreshToken = expressjwt({
	secret: Config.REFRESH_TOKEN_SECRET as string,
	algorithms: ["HS256"],
	getToken: (req: Request) => {
		const { refreshToken } = req.cookies as AuthCookie;
		return refreshToken;
	},
});

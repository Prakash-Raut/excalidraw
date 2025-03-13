import fs from "node:fs";
import path from "node:path";

import { securityConfig } from "@workspace/common";
import type { User } from "@workspace/database";
import { prisma } from "@workspace/database";
import createHttpError from "http-errors";
import { type JwtPayload, sign } from "jsonwebtoken";

export class TokenService {
	constructor(private prismaClient = prisma) {}

	generateAccessToken(payload: JwtPayload) {
		let privateKey: Buffer;
		try {
			privateKey = fs.readFileSync(
				path.join(process.cwd(), "certs/private.pem"),
			);
		} catch (error) {
			const err = createHttpError(500, "Error while reading private key");
			throw err;
		}

		const accessToken = sign(payload, privateKey, {
			algorithm: "RS256",
			expiresIn: "1d",
			issuer: "auth-service",
			header: {
				alg: "RS256",
				kid: securityConfig.jwtKeyId,
			},
		});

		return accessToken;
	}

	generateRefreshToken = (payload: JwtPayload) => {
		const refreshToken = sign(payload, securityConfig.refreshTokenSecret, {
			algorithm: "HS256",
			expiresIn: "1y",
			issuer: "auth-service",
			jwtid: String(payload.id),
			header: {
				alg: "HS256",
				kid: securityConfig.jwtKeyId,
			},
		});

		return refreshToken;
	};

	persistRefreshToken = async (user: Partial<User>) => {
		const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

		if (!user.id) {
			throw new Error("User id is required to persist refresh token");
		}

		const newRefreshToken = await this.prismaClient.refreshToken.create({
			data: {
				userId: user.id,
				expiresAt: new Date(Date.now() + MS_IN_YEAR),
			},
		});

		return newRefreshToken;
	};

	deleteRefreshToken = async (refreshTokenId: number) => {
		return await this.prismaClient.refreshToken.delete({
			where: { id: refreshTokenId },
		});
	};
}

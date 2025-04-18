import type { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import type { ZodSchema } from "zod";

export const validateRequest =
	(schema: ZodSchema): RequestHandler =>
	(req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			next(createHttpError(400, { errors: result.error.format() }));
			return;
		}

		req.body = result.data;
		next();
	};

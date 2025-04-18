import type { Logger } from "@workspace/common";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { UserService } from "../services/UserService";

export class UserController {
	constructor(
		private userService: UserService,
		private logger: Logger,
	) {}

	async create(req: Request, res: Response, next: NextFunction) {
		const { name, email, password } = req.body;
		try {
			const user = await this.userService.create({ name, email, password });

			this.logger.info("User has been created", { id: user.id });

			res.status(201).json({ id: user.id });
		} catch (error) {
			next(error);
		}
	}

	async get(req: Request, res: Response, next: NextFunction) {
		const { userId } = req.params;

		this.logger.debug("Request for fetching a user", { userId });

		if (!userId) {
			return next(createHttpError(400, "User ID is required"));
		}

		try {
			const user = await this.userService.get(+userId);

			if (!user) {
				return next(createHttpError(404, "User not found"));
			}

			this.logger.info("User has been fetched", { userId });

			res.status(200).json({ id: user.id, name: user.name });
		} catch (error) {
			next(error);
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction) {}

	async update(req: Request, res: Response, next: NextFunction) {}

	async delete(req: Request, res: Response, next: NextFunction) {}
}

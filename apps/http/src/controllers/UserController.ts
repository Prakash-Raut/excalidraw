import {
	createUserSchema,
	querySchema,
	updateUserSchema,
} from "@workspace/common";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type { Logger } from "winston";
import type { UserService } from "../services/UserService";
import type { CreateUserRequest, UpdateUserRequest } from "../types";

export class UserController {
	constructor(
		private userService: UserService,
		private logger: Logger,
	) {}

	create = async (
		req: CreateUserRequest,
		res: Response,
		next: NextFunction,
	) => {
		const { error, data, success } = createUserSchema.safeParse(req.body);

		if (!success) {
			return next(createHttpError(400, error.message));
		}

		const { firstName, lastName, email, password } = data;

		this.logger.debug("Request for creating a user", req.body);

		try {
			const user = await this.userService.create({
				firstName,
				lastName,
				email,
				password,
			});

			this.logger.info("User has been created", { id: user.id });

			res.status(201).json({ id: user.id });
		} catch (error) {
			next(error);
		}
	};

	getAll = async (req: Request, res: Response, next: NextFunction) => {
		const { error, data, success } = querySchema.safeParse(req.query);

		if (!success) {
			return next(createHttpError(400, error.message));
		}

		this.logger.debug("Request for fetching all users", req.query);

		const { q, currentPage, perPage } = data;

		try {
			const { users, totalUsers } = await this.userService.getAll({
				q,
				currentPage,
				perPage,
			});

			this.logger.info("All Users have been fetched", {
				count: totalUsers,
			});

			res.json({
				currentPage: currentPage,
				perPage: perPage,
				total: totalUsers,
				data: users,
			});
		} catch (error) {
			next(error);
		}
	};

	getOne = async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.params.id;

		if (Number.isNaN(Number(userId))) {
			const err = createHttpError(400, "Invalid url param");
			return next(err);
		}

		try {
			const user = await this.userService.findById(Number(userId));

			if (!user) {
				const err = createHttpError(404, "User does not exist");
				return next(err);
			}

			this.logger.info("User has been fetched", { id: user.id });
			res.json(user);
		} catch (error) {
			next(error);
		}
	};

	update = async (
		req: UpdateUserRequest,
		res: Response,
		next: NextFunction,
	) => {
		const { error, data, success } = updateUserSchema.safeParse(req.body);

		if (!success) {
			return next(createHttpError(400, error.message));
		}

		const userId = req.params.id;
		const { firstName, lastName, email } = data;

		this.logger.debug("Request for updating a user", req.body);

		try {
			await this.userService.update(Number(userId), {
				firstName,
				lastName,
				email,
			});

			this.logger.info("User has been updated", { id: Number(userId) });
			res.json({ id: Number(userId) });
		} catch (error) {
			next(error);
		}
	};

	destroy = async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.params.id;

		if (Number.isNaN(Number(userId))) {
			const err = createHttpError(400, "Invalid url param");
			return next(err);
		}

		try {
			const user = await this.userService.deleteById(Number(userId));

			if (!user) {
				const err = createHttpError(404, "User does not exist");
				return next(err);
			}

			this.logger.info("User has been deleted", { id: Number(userId) });
			res.json({ id: Number(userId) });
		} catch (error) {
			next(error);
		}
	};
}

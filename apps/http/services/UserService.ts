import { prisma } from "@workspace/database";

type CreateUserPayload = {
	name: string;
	email: string;
	password: string;
};

export class UserService {
	constructor(private db = prisma) {}

	async create(payload: CreateUserPayload) {
		try {
			const newUser = await this.db.user.create({
				data: {
					name: payload.name,
					email: payload.email,
					password: payload.password,
				},
			});
			return newUser;
		} catch (error) {
			throw new Error("Failed to create user");
		}
	}

	async get(userId: number) {
		try {
			const user = await this.db.user.findUnique({
				where: { id: userId },
			});
			return user;
		} catch (error) {
			throw new Error("Failed to fetch user from the database");
		}
	}

	async getAll() {
		try {
			const users = await this.db.user.findMany();
			return users;
		} catch (error) {
			throw new Error("Failed to fetch users from the database");
		}
	}

	async update(userId: number, payload: Partial<CreateUserPayload>) {
		try {
			const updatedUser = await this.db.user.update({
				where: { id: userId },
				data: payload,
			});
			return updatedUser;
		} catch (error) {
			throw new Error("Failed to update user");
		}
	}

	async delete(userId: number) {
		try {
			return await this.db.user.delete({
				where: { id: userId },
			});
		} catch (error) {
			throw new Error("Failed to delete user");
		}
	}
}

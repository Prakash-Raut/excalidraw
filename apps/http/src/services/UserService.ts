import type {
	LimitedUserData,
	UserData,
	UserQueryParams,
} from "@workspace/common";
import { prisma } from "@workspace/database";
import bcrypt from "bcryptjs";

export class UserService {
	constructor(private prismaClient = prisma) {}

	create = async ({ firstName, lastName, email, password }: UserData) => {
		const hashedPassword = await bcrypt.hash(password, 10);
		try {
			const userWithEmailExists = await this.prismaClient.user.findFirst({
				where: { email },
			});

			if (userWithEmailExists) {
				throw new Error("Email already exists");
			}

			return await this.prismaClient.user.create({
				data: {
					firstName,
					lastName,
					email,
					password: hashedPassword,
				},
			});
		} catch (error) {
			throw new Error("Failed to create user");
		}
	};

	findByEmailWithPassword = async (email: string) => {
		try {
			return await this.prismaClient.user.findFirst({
				where: { email },
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					password: true,
				},
			});
		} catch (error) {
			throw new Error("Failed to fetch user from the database");
		}
	};

	findById = async (id: number) => {
		try {
			return await this.prismaClient.user.findFirst({
				where: { id },
			});
		} catch (error) {
			throw new Error("Failed to fetch user from the database");
		}
	};

	getAll = async (validatedQuery: UserQueryParams) => {
		const { currentPage, perPage, q } = validatedQuery;

		// Count total users matching the query
		const totalUsers = await prisma.user.count({
			where: q
				? {
						OR: [
							{
								firstName: {
									contains: q,
									mode: "insensitive", // Case-insensitive search
								},
							},
							{
								lastName: {
									contains: q,
									mode: "insensitive",
								},
							},
							{
								email: {
									contains: q,
									mode: "insensitive",
								},
							},
						],
					}
				: undefined,
		});

		// Fetch paginated users
		const users = await prisma.user.findMany({
			where: q
				? {
						OR: [
							{
								firstName: {
									contains: q,
									mode: "insensitive",
								},
							},
							{
								lastName: {
									contains: q,
									mode: "insensitive",
								},
							},
							{
								email: {
									contains: q,
									mode: "insensitive",
								},
							},
						],
					}
				: undefined,
			skip: (currentPage - 1) * perPage,
			take: perPage,
			orderBy: {
				id: "desc",
			},
		});

		return { users, totalUsers };
	};

	update = async (
		userId: number,
		{ firstName, lastName, email }: LimitedUserData,
	) => {
		try {
			return await this.prismaClient.user.update({
				where: { id: userId },
				data: {
					firstName,
					lastName,
					email,
				},
			});
		} catch (err) {
			throw new Error("Failed to update user");
		}
	};

	deleteById = async (userId: number) => {
		try {
			return await this.prismaClient.user.delete({
				where: { id: userId },
			});
		} catch (error) {
			throw new Error("Failed to fetch user from the database");
		}
	};

	findByEmailWithoutSensitiveInfo = async (email: string) => {
		try {
			return await this.prismaClient.user.findFirst({
				where: { email },
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
				},
			});
		} catch (error) {
			throw new Error("Failed to fetch user from the database");
		}
	};
}

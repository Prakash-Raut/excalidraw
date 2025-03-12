import { prisma } from "./client";

import type { Prisma } from "./client";

const DEFAULT_USERS: Prisma.UserCreateInput[] = [
	{
		firstName: "Tim",
		lastName: "Apple",
		email: "tim@apple.com",
		password: "tim@123",
	},
];

(async () => {
	try {
		await Promise.all(
			DEFAULT_USERS.map((user) =>
				prisma.user.upsert({
					where: {
						email: user.email,
					},
					update: {
						...user,
					},
					create: {
						...user,
					},
				}),
			),
		);
	} catch (error) {
		console.error(error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
})();

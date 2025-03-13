import { prisma } from "@workspace/database";

export class ChatService {
	constructor(private prismaClient = prisma) {}

	getAll = async (roomId: number) => {
		try {
			const messages = await this.prismaClient.chat.findMany({
				where: {
					roomId,
				},
				orderBy: {
					id: "desc",
				},
				take: 100,
			});
			return messages;
		} catch (error) {
			throw new Error("Failed to fetch messages from the database");
		}
	};
}

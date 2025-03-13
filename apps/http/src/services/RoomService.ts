import type { RoomData } from "@workspace/common";
import { prisma } from "@workspace/database";

export class RoomService {
	constructor(private prismaClient = prisma) {}

	create = async ({ ownerId }: RoomData) => {
		try {
			return await this.prismaClient.room.create({
				data: {
					adminId: ownerId,
				},
			});
		} catch (error) {
			throw new Error("Failed to create room");
		}
	};

	getOne = async (id: number) => {
		try {
			return await this.prismaClient.room.findUnique({
				where: { id },
			});
		} catch (error) {
			throw new Error("Failed to fetch room from the database");
		}
	};

	delete = async (id: number) => {
		try {
			return await this.prismaClient.room.delete({
				where: { id },
			});
		} catch (error) {
			throw new Error("Failed to delete room");
		}
	};
}

import { prisma } from "@workspace/database";

export class RoomService {
	constructor(private prismaClient = prisma) {}

	create = async () => {
		try {
			const newRoom = await this.prismaClient.room.create({
				data: {
					elements: [],
				},
			});
			return newRoom;
		} catch (error) {
			throw new Error("Failed to create room");
		}
	};

	join = async (roomId: string) => {
		try {
			const room = await this.prismaClient.room.findUnique({
				where: { id: roomId },
			});
			return room;
		} catch (error) {
			throw new Error("Failed to fetch room from the database");
		}
	};

	delete = async (roomId: string) => {
		try {
			return await this.prismaClient.room.delete({
				where: { id: roomId },
			});
		} catch (error) {
			throw new Error("Failed to delete room");
		}
	};
}

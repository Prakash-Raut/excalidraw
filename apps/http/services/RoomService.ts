import { prisma } from "@workspace/database";
import { v4 as uuidv4 } from "uuid";

export class RoomService {
	constructor(private db = prisma) {}

	create = async (userId: number) => {
		const slug = uuidv4();
		try {
			const newRoom = await this.db.room.create({
				data: {
					slug,
					userId,
				},
			});
			return newRoom;
		} catch (error) {
			throw new Error("Failed to create room");
		}
	};

	join = async (roomId: number) => {
		try {
			const room = await this.db.room.findUnique({
				where: { id: roomId },
			});
			return room;
		} catch (error) {
			throw new Error("Failed to fetch room from the database");
		}
	};

	delete = async (roomId: number) => {
		try {
			return await this.db.room.delete({
				where: { id: roomId },
			});
		} catch (error) {
			throw new Error("Failed to delete room");
		}
	};
}

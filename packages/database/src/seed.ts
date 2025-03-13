import { hash } from "bcryptjs";
import { prisma } from "./client";
import type { Prisma } from "./client";

async function main() {
	// Seed Users
	const DEFAULT_USERS: Prisma.UserCreateInput[] = [
		{
			firstName: "Tim",
			lastName: "Apple",
			email: "tim@apple.com",
			password: await hash("tim@123", 10),
		},
		{
			firstName: "Elon",
			lastName: "Musk",
			email: "elon@tesla.com",
			password: await hash("elon@123", 10),
		},
	];

	const users = await Promise.all(
		DEFAULT_USERS.map((user) =>
			prisma.user.upsert({
				where: { email: user.email },
				update: {},
				create: user,
			}),
		),
	);

	if (users.length === 0) {
		throw new Error(
			"❌ No users created. Cannot proceed with room or chat seeding.",
		);
	}

	// Seed Rooms (Assign Tim as admin)
	const DEFAULT_ROOMS = users.map((user) => ({
		adminId: user.id,
	}));

	const rooms = await Promise.all(
		DEFAULT_ROOMS.map((room) =>
			prisma.room.create({
				data: room,
			}),
		),
	);

	if (rooms.length === 0) {
		throw new Error("❌ No rooms created. Cannot proceed with chat seeding.");
	}

	// ✅ Guarantee a fallback room
	const fallbackRoomId = rooms[0]?.id;
	if (!fallbackRoomId) {
		throw new Error("❌ Failed to retrieve a valid room ID.");
	}

	// Seed Chats (Each user sends a message in a room)
	const DEFAULT_CHATS = users.map((user, index) => ({
		message: `Hello from ${user.firstName}`,
		userId: user.id,
		roomId: rooms[index % rooms.length]?.id ?? fallbackRoomId, // Assign chats to available rooms
	}));

	await Promise.all(
		DEFAULT_CHATS.map((chat) =>
			prisma.chat.create({
				data: chat,
			}),
		),
	);

	console.log("✅ Database successfully seeded!");
}

main()
	.catch((error) => {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

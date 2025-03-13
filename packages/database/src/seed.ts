import { prisma } from "./client";

async function main() {
	// Seed Rooms (now without names)
	const rooms = await Promise.all(
		Array.from({ length: 3 }).map(() => prisma.room.create({ data: {} })),
	);

	if (rooms.length === 0) {
		throw new Error("❌ No rooms created. Cannot proceed.");
	}

	// ✅ Ensure at least one room exists
	const fallbackRoomId = rooms[0]?.id;
	if (!fallbackRoomId) {
		throw new Error("❌ Failed to retrieve a valid room ID.");
	}

	// Seed Example Drawings (Assign to rooms)
	const DEFAULT_DRAWINGS = [
		{
			roomId: rooms[0]?.id,
			elements: [
				{
					type: "rectangle",
					x: 100,
					y: 100,
					width: 200,
					height: 100,
					color: "blue",
				},
				{
					type: "ellipse",
					x: 300,
					y: 200,
					width: 150,
					height: 150,
					color: "red",
				},
			],
		},
		{
			roomId: rooms[1]?.id,
			elements: [
				{ type: "line", x1: 50, y1: 50, x2: 400, y2: 50, color: "green" },
				{
					type: "text",
					x: 200,
					y: 150,
					text: "Welcome to Brainstorming!",
					fontSize: 20,
				},
			],
		},
	];

	await Promise.all(
		DEFAULT_DRAWINGS.map((drawing) =>
			prisma.room.update({
				where: { id: drawing.roomId },
				data: { elements: drawing.elements },
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

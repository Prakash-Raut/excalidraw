import { prisma } from "./client.js";

async function main() {
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

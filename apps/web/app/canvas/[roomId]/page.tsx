import { RoomCanvas } from "@/components/room-canvas";

export default async function CanvasPage({
	params,
}: {
	params: Promise<{ roomId: string }>;
}) {
	const roomId = (await params).roomId;

	return <RoomCanvas roomId={roomId} />;
}

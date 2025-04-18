"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
	const [socket, setSocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:3000");

		ws.onopen = () => {
			setSocket(ws);
			const data = JSON.stringify({
				type: "join_room",
				roomId,
			});
			console.log(data);
			ws.send(data);
		};
	}, [roomId]);

	if (!socket) {
		return <div>Connecting to server....</div>;
	}

	return (
		<div>
			<Canvas roomId={roomId} socket={socket} />
		</div>
	);
}

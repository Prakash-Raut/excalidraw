"use client";

import { Game } from "@/draw/Game";
import type { Tool } from "@/types";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./icon-button";

export function Canvas({
	roomId,
	socket,
}: {
	socket: WebSocket;
	roomId: string;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [game, setGame] = useState<Game>();
	const [selectedTool, setSelectedTool] = useState<Tool>("circle");

	useEffect(() => {
		game?.setTool(selectedTool);
	}, [selectedTool, game]);

	useEffect(() => {
		if (canvasRef.current) {
			const g = new Game(canvasRef.current, roomId, socket);
			setGame(g);

			return () => {
				g.destroy();
			};
		}
	}, [roomId, socket]);

	return (
		<div
			style={{
				height: "100vh",
				overflow: "hidden",
			}}
		>
			<canvas
				ref={canvasRef}
				width={window.innerWidth}
				height={window.innerHeight}
			/>
			<Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
		</div>
	);
}

function Topbar({
	selectedTool,
	setSelectedTool,
}: {
	selectedTool: Tool;
	setSelectedTool: (s: Tool) => void;
}) {
	return (
		<div
			style={{
				position: "fixed",
				top: 10,
				left: 10,
			}}
		>
			<div className="flex gap-t">
				<IconButton
					onClick={() => {
						setSelectedTool("pencil");
					}}
					activated={selectedTool === "pencil"}
					icon={<Pencil />}
				/>
				<IconButton
					onClick={() => {
						setSelectedTool("rectangle");
					}}
					activated={selectedTool === "rectangle"}
					icon={<RectangleHorizontalIcon />}
				/>
				<IconButton
					onClick={() => {
						setSelectedTool("circle");
					}}
					activated={selectedTool === "circle"}
					icon={<Circle />}
				/>
			</div>
		</div>
	);
}

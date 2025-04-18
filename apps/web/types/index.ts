export type Rectangle = {
	type: "rectangle";
	x: number;
	y: number;
	width: number;
	height: number;
};

export type Circle = {
	type: "circle";
	centerX: number;
	centerY: number;
	radius: number;
};

export type PencilLine = {
	type: "pencil";
	startX: number;
	startY: number;
	endX: number;
	endY: number;
};

export type Shape = Rectangle | Circle | PencilLine;

export type Tool = "circle" | "rectangle" | "pencil";

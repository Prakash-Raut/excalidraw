import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

export function IconButton({
	icon,
	onClick,
	activated,
}: {
	icon: ReactNode;
	onClick: () => void;
	activated: boolean;
}) {
	return (
		<Button
			className={cn(
				"m-2 pointer rounded-full border p-2 bg-black hover:bg-gray text-white",
				{ "text-red-400": activated },
			)}
			onClick={onClick}
			onKeyUp={onClick}
		>
			{icon}
		</Button>
	);
}

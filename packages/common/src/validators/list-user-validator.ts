import { z } from "zod";

export const querySchema = z.object({
	q: z.string().trim().optional().default(""),
	currentPage: z
		.string()
		.transform((value) => Number(value))
		.refine((val) => !Number.isNaN(val) && val > 0, {
			message: "currentPage must be a valid number greater than 0",
		}),
	perPage: z
		.string()
		.transform((value) => Number(value))
		.refine((val) => !Number.isNaN(val) && val > 0, {
			message: "perPage must be a valid number greater than 0",
		}),
});

import { z } from "zod";

export const loginUserSchema = z.object({
	email: z
		.string({ required_error: "Email is required!" })
		.trim()
		.email("Email should be a valid email!"),
	password: z
		.string({ required_error: "Password is required!" })
		.trim()
		.min(8, "Password length should be at least 8 characters!"),
});

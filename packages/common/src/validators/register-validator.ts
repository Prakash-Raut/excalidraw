import { z } from "zod";

export const registerUserSchema = z.object({
	email: z
		.string({ required_error: "Email is required!" })
		.trim()
		.email("Email should be a valid email!"),
	firstName: z
		.string({ required_error: "First name is required!" })
		.trim()
		.min(1, "First name is required!"),
	lastName: z
		.string({ required_error: "Last name is required!" })
		.trim()
		.min(1, "Last name is required!"),
	password: z
		.string({ required_error: "Password is required!" })
		.trim()
		.min(8, "Password length should be at least 8 characters!"),
});

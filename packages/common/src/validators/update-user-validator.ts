import { z } from "zod";

export const updateUserSchema = z.object({
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
});

"use server";

export default async function login(
	prevState: Record<string, unknown>,
	formData: FormData,
) {
	const email = formData.get("email");
	const password = formData.get("password");

	try {
		console.log("email", email);
		console.log("password", password);
		return { type: "success", message: "Login successful" };
	} catch (error) {
		console.error("Login failed", error, prevState);
		return {
			type: "error",
			message: "An error occurred while logging in!",
		};
	}
}

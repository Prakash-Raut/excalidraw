export const Roles = {
	ADMIN: "admin",
	CUSTOMER: "customer",
	MANAGER: "manager",
} as const;

export const GOOGLE_OAUTH_SCOPES = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile",
];

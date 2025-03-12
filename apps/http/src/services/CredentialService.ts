import bcrypt from "bcryptjs";

export class CredentialService {
	comparePassword = async (userPassword: string, hashedPassword: string) => {
		return await bcrypt.compare(userPassword, hashedPassword);
	};
}

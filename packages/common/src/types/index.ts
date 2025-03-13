import type { Request } from "express";

export interface UserData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface RegisterUserRequest extends Request {
	body: UserData;
}

export interface AuthRequest extends Request {
	auth: {
		sub: string;
		id?: number;
		firstName?: string;
		lastName?: string;
		email?: string;
	};
}

export type AuthCookie = {
	accessToken: string;
	refreshToken: string;
};

export interface IRefreshTokenPayload {
	id: string;
	sub: string;
}

export interface CreateUserRequest extends Request {
	body: UserData;
}

export interface LimitedUserData {
	firstName: string;
	lastName: string;
	email: string;
}

export interface UpdateUserRequest extends Request {
	body: LimitedUserData;
}

export interface UserQueryParams {
	currentPage: number;
	perPage: number;
	q: string;
}

export interface RoomData {
	ownerId: number;
}

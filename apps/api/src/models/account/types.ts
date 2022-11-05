export interface UserAccount {
	username: string;
}

export interface UserAccountCredentials extends UserAccount {
	password: string;
}

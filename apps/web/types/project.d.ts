interface Project {
	id: string;
	name: string;
	status: {
		value: string;
	};
	updatedAt: Date;
	owner: {
		username: string;
	};
}

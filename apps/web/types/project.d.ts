interface Project {
	id: number;
	name: string;
	status: string;
	updatedAt: Date;
	owner: {
		name: string;
	};
}

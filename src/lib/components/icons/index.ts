interface Icon {
	id: string;
	url: string;
	title?: string;
	width: number;
	height: number;
	tnp_id: string;
	tags?: string[];
	term?: string;
	collections?: string[];
}

interface Category {
	name: string;
	icons: Icon[];
}

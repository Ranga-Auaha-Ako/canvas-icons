import type { Icon } from 'sveltestrap';
const found_categories = import.meta.globEager('./icon-data/*.json');

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

const categoryOrder = [
	'./Teaching.json',
	'./General.json',
	'./Aotearoa.json',
	'./Architecture.json',
	'./Arts.json',
	'./Business.json',
	'./Engineering.json',
	'./Food.json',
	'./Law.json',
	'./Medical.json',
	'./People.json',
	'./Places.json',
	'./Science.json',
	'./Sports.json'
];

const categories: Category[] = categoryOrder.map((filename) => {
	const data = found_categories[filename];
	const name = filename
		.split(/(\\|\/)/g)
		.pop()
		.replace('.json', '');
	return { name, icons: data.icons };
});

export default categories;
export const getIconClass = (url: string): string => {
	// eg : svg-Aotearoa--noun_Beehive_147848
	// Strip svg from end
	url = url.replace(/\.svg$/, '');
	url = url.replace(/\s/g, '_');
	// Split into folders
	const parts = url.split('/');
	return `${parts.join('--')}`;
};
export type { Icon, Category };

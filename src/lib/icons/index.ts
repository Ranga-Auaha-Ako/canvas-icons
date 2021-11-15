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
	'./icon-data/Teaching.json',
	'./icon-data/General.json',
	'./icon-data/Aotearoa.json',
	'./icon-data/Architecture.json',
	'./icon-data/Arts.json',
	'./icon-data/Business.json',
	'./icon-data/Engineering.json',
	'./icon-data/Food.json',
	'./icon-data/Law.json',
	'./icon-data/Medical.json',
	'./icon-data/People.json',
	'./icon-data/Places.json',
	'./icon-data/Science.json',
	'./icon-data/Sports.json'
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

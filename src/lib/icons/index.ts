import { env } from '$env/dynamic/public';

export interface Icon {
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

export interface Category {
	name: string;
	icons: Icon[];
}

export interface foundCategory {
	category: string;
	icons: string[];
}

export const getIconUrl = (url: string, colour = '#000000', iconInBox = false): string => {
	return `${env.PUBLIC_ASSET_HOST}/colour/${url.replace(
		'.svg',
		`.${iconInBox ? 'ffffff' : colour.replace('#', '')}.svg`
	)}`;
};

export const getIconClass = (url: string): string => {
	// eg : svg-Aotearoa--noun_Beehive_147848
	// eg : svg-Aotearoa--noun-Beehive-147848
	// Strip svg from end
	url = url.replace(/\.svg$/, '');
	url = url.replace(/\s/g, '-');
	url = url.replace(/_/g, '-');
	// Split into folders
	const parts = url.split('/');
	return `${parts.join('--')}`;
};

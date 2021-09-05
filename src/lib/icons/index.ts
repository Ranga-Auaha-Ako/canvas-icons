import * as teaching from './icon15.json';
import * as general from './icon1.json';
import * as aotearoa from './icon2.json';
import * as architecture from './icon3.json';
import * as arts from './icon4.json';
import * as business from './icon5.json';
import * as engineering from './icon6.json';
import * as food from './icon7.json';
import * as law from './icon8.json';
import * as medical from './icon9.json';
import * as people from './icon10.json';
import * as places from './icon11.json';
import * as science from './icon12.json';
import * as sports from './icon13.json';
import * as time from './icon1.json';

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
  
  
  

const categories : Category[] = [
	{ name: 'Teaching', icons: teaching.icons },
	{ name: 'General', icons: general.icons },
	{ name: 'Aotearoa', icons: aotearoa.icons },
	{ name: 'Architecture', icons: architecture.icons },
	{ name: 'Arts', icons: arts.icons },
	{ name: 'Business', icons: business.icons },
	{ name: 'Engineering', icons: engineering.icons },
	{ name: 'Food', icons: food.icons },
	{ name: 'Law', icons: law.icons },
	{ name: 'Medical', icons: medical.icons },
	{ name: 'People', icons: people.icons },
	{ name: 'Places', icons: places.icons },
	{ name: 'Science', icons: science.icons },
	{ name: 'Sports', icons: sports.icons },
	{ name: 'Time', icons: time.icons }
]

export default categories
export type {Icon, Category}

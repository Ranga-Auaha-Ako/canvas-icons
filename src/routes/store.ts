import { writable } from 'svelte-local-storage-store';

// Utility function to prefix writable localstorage keys
const pf = (k) => `iconConfig-v2-${k}`;

export const colour = writable(pf('colour'), '#000000');

export const iconMargin = writable(pf('iconMargin'), 0);
export const iconPadding = writable(pf('iconPadding'), 0);
export const iconSize = writable(pf('iconSize'), -1);
export const iconOffset = writable(pf('offset'), 0);
export const iconInBox = writable(pf('iconInBox'), false);
export const showMargin = writable(pf('showMargin'), false);
export const showSettings = writable(pf('showSettings'), false);
export const iconPreviewPosition = writable(pf('iconPreviewPosition'), <'h2' | 'h3' | 'p'>'h2');

export const recentIcons = writable(pf('recentIcons'), []);

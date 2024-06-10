import { persisted } from 'svelte-local-storage-store';

// Utility function to prefix persisted localstorage keys
const pf = (k: string) => `iconConfig-v2-${k}`;

export const colour = persisted(pf('colour'), '#000000');

export const iconMargin = persisted(pf('iconMargin'), 0);
export const iconPadding = persisted(pf('iconPadding'), 0);
export const iconSize = persisted(pf('iconSize'), -1);
export const iconOffset = persisted(pf('offset'), 0);
export const iconInBox = persisted(pf('iconInBox'), false);
export const showMargin = persisted(pf('showMargin'), false);
export const showSettings = persisted(pf('showSettings'), false);
export const iconPreviewPosition = persisted(pf('iconPreviewPosition'), <'h2' | 'h3' | 'p'>'h2');

export const recentIcons = persisted<string[]>(pf('recentIcons'), []);

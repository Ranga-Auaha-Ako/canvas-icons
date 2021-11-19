import { writable } from 'svelte-local-storage-store';
// import categories from 'uoa-canvas-icons';
// import rfdc from 'rfdc';

// const clone = rfdc();
// export const unsavedStateCategories = writable('preferences', clone(categories))

export const nounProjectAuth = writable('nounProjectAuth', {
	key: '',
	secret: ''
});

import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: node(),
		files: {
			hooks: {
				server: 'src/hooks/hooks.ts'
			}
		},
		csrf: {
      checkOrigin: false,
    }
	}
};

export default config;

import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: node(),
		files: {
			hooks: 'src/hooks/hooks.ts'
		}
		// https://jenyus.web.app/blog/2021-05-30-setting-up-a-development-environment-for-sveltekit-with-docker-and-compose
		// "Vite uses Chokidar under the hood to watch files, and its default method of doing so doesn't work in Docker containers"
		// vite: {
		// 	server: {
		// 		watch: {
		// 			usePolling: true
		// 		}
		// 	}
		// }
	}
};

export default config;

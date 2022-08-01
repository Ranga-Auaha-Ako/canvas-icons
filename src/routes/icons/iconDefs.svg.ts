// import { session } from '$app/stores';

/** @type {import('@sveltejs/kit').RequestHandler} */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function GET() {
	// code goes here
	const assetHost = process.env.VITE_ASSET_HOST;
	const iconsURL = `${assetHost}/font/defs/svg/sprite.defs.svg`;
	try {
		const icons = await fetch(iconsURL).then((res) => res.text());
		return {
			status: 200,
			body: icons,
			headers: {
				'Content-Type': 'image/svg+xml'
			}
		};
	} catch (error) {
		return {
			status: 500
		};
	}
}

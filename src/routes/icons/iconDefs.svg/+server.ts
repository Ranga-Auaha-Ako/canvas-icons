import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

/** @type {import('@sveltejs/kit').RequestHandler} */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function GET() {
	// code goes here
	const assetHost = env.PUBLIC_ASSET_HOST;
	const iconsURL = `${assetHost}/font/defs/svg/sprite.defs.svg`;
	try {
		const icons = await fetch(iconsURL).then((res) => res.text());
		return json(icons, {
			headers: {
				'Content-Type': 'image/svg+xml'
			}
		});
	} catch (error) {
		return new Response(undefined, { status: 500 });
	}
}

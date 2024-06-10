import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';
import { version } from '../../package.json';


export const load: LayoutServerLoad = async ({request}) => {
	const assetHost = env.PUBLIC_ASSET_HOST;
	const testEnv = env.PUBLIC_TEST_ENV === 'true';
	if (request.body) {
		const body = await request.formData();
		return {
			user: {
				name: body.get('lis_person_name_given')
			},
			data: body.get('data'),
			callback: body.get('content_item_return_url'),
			version,
			// Asset host goes here to allow environment to be updated post-build
			assetHost,
			testEnv
		};
	} else {
		return { version, assetHost, testEnv };
	}
};


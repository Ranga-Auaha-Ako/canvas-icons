import { version } from '../../package.json';
import { env } from '$env/dynamic/public';
import 'dotenv/config';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import lti from '@smarterservices/ims-lti'

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({ request }) {
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
}

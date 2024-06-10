
import { env } from '$env/dynamic/public';
import { version } from '../../package.json';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({request}) => {
	const assetHost = env.PUBLIC_ASSET_HOST;
	const testEnv = env.PUBLIC_TEST_ENV === 'true';
	return { version, assetHost, testEnv };

}

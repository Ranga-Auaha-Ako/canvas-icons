import { version } from '../../package.json'
import 'dotenv/config'
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import lti from '@smarterservices/ims-lti'

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({request}) {
    const assetHost = process.env.VITE_ASSET_HOST
    if(request.body) {
        const body = await request.json()
        return {
            user: {
                name: body.get("lis_person_name_given"),
            },
            data: body.get("data"),
            callback: body.get("content_item_return_url"),
            version,
            // Asset host goes here to allow environment to be updated post-build
            assetHost
        }
    } else {
        return {version,assetHost}
    }
}
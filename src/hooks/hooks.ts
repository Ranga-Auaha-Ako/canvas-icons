import { version } from '../../package.json'
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import lti from '@smarterservices/ims-lti'


/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
    if(request.body) {
        return {
            user: {
                name: request.body.get("lis_person_name_given"),
            },
            data: request.body.get("data"),
            callback: request.body.get("content_item_return_url"),
            version,
        }
    } else {
        return {version,}
    }
}
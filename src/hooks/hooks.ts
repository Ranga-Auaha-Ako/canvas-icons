// import lti from '@smarterservices/ims-lti'


/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
    // const provider = new lti.Provider("", "");
    // if(provider.valid_request(request)) {
    //     console.log(`${provider.body.username} made a valid request!`)
    // } else {
    //     console.warn(`${provider.body.username} didn't made a valid request.`)
    // }
    if(request.body) {
        return {
            user: {
                name: request.body.get("lis_person_name_given"),
            },
            data: request.body.get("data"),
            callback: request.body.get("content_item_return_url"),
            // req: [...(request.body ? request.body.entries() : null)]
        }
    } else {
        return {}
    }
}

// /** @type {import('@sveltejs/kit').Handle} */
// export async function handle({ request, resolve }) {
//     // request.headers["oauth_consumer_key"]


// 	const response = await resolve(request);

// 	return {
// 		...response,
// 		headers: {
// 			...response.headers,
// 			'x-custom-header': 'potato'
// 		}
// 	};
// }

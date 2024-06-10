import type { Actions } from './$types';

export const actions = {
	default: async ({request}) => {
		if (request.body) {
			const body = await request.formData();
			return {
				user: {
					name: body.get('lis_person_name_given')
				},
				data: body.get('data'),
				callback: body.get('content_item_return_url'),
			};
		} else {
		}
},
} satisfies Actions;


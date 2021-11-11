import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';


/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
 // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
 export async function post(req) {
	const oauth = new OAuth({
		consumer: { key: req.body.key, secret: req.body.secret },
		signature_method: 'HMAC-SHA1',
		hash_function(base_string, key) {
			return crypto.createHmac('sha1', key).update(base_string).digest('base64');
		}
	});
	const request_data = {
        url: `https://api.thenounproject.com/icon/${req.body.id}`,
        method: 'get',
    };
    try {
      const response = await axios.get(request_data.url,{
          headers: { ...oauth.toHeader(oauth.authorize(request_data)) }
        })
      return {body: response.data}
    } catch (error) {
      return {status: 500, body: {error: "The Noun Project returned an error."}}
    }
}

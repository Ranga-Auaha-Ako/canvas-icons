import OAuth1Signature from 'oauth1-signature';
import { escape } from 'html-escaper';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function GET(req) {
	const data = req.url.searchParams.get('data');
	const iconUrl = req.url.searchParams.get('icon-url');
	const colour = req.url.searchParams.get('colour');
	const iconMargin = req.url.searchParams.get('margin');
	const iconPadding = req.url.searchParams.get('padding');
	const iconSize = req.url.searchParams.get('size');
	const iconOffset = req.url.searchParams.get('offset');
	const iconInBox = req.url.searchParams.get('inBox') == 'true';
	const callback = req.url.searchParams.get('callback');

	const iconSizeFormatted = iconSize == -1 ? '1em' : `${iconSize}px`;

	if (!data || !iconUrl || !callback) {
		// Missing critical data
		return {
			status: 400,
			headers: {
				'content-type': 'text/html; charset=utf-8'
			},
			body: '<h1>Missing critical data! Please contact an administrator.</h1>'
		};
	}

	// const content_items = `{"@context":"http://purl.imsglobal.org/ctx/lti/v1/ContentItem","@graph":[{"@type":"ContentItem","mediaType":"text/html","text":"<img role='presentation' src='${iconUrl}' alt='' width='48' height='48' data-decorative='true' />","placementAdvice":{"presentationDocumentTarget":"embed"}}]}`;
	// const content_items = `{"@context":"http://purl.imsglobal.org/ctx/lti/v1/ContentItem","@graph":[{"@type":"ContentItem","mediaType":"text/html","text":"<img role='presentation' alt='' data-decorative='true' src='${iconUrl}' width='${iconSize}' height='${iconSize}' style='padding: ${iconMargin}rem; position: relative;bottom: ${iconOffset}px'/>","placementAdvice":{"presentationDocumentTarget":"embed"}}]}`;
	const content_items = `{"@context":"http://purl.imsglobal.org/ctx/lti/v1/ContentItem","@graph":[{"@type":"ContentItem","mediaType":"text/html","text":"
	<img src='${iconUrl}' style='
		display: inline-block;
		border-radius: 3px;
		position: relative;
		top: ${iconOffset * -1}em;
		background: ${iconInBox ? colour : '#fff'};
		width: ${iconSizeFormatted};
		height: ${iconSizeFormatted};
		margin: ${iconMargin}px;
		padding: ${iconInBox ? iconPadding : 0}px;
		' role='presentation' alt='' data-decorative='true'/>
	","placementAdvice":{"presentationDocumentTarget":"embed"}}]}`;

	const signature = OAuth1Signature({
		consumerKey: '',
		consumerSecret: '',
		url: `http://${req.host}${req.url.pathname}`,
		method: 'POST',
		queryParams: { data, content_items }
	});

	return {
		// body: { ...signature.params, path: `//${req.host}${req.url.pathname}` }
		headers: {
			'content-type': 'text/html; charset=utf-8'
		},
		body: `
		<form action="${callback}" class="hide" id="return_form" method="post" encType="application/x-www-form-urlencoded">
			<input type="hidden" name="lti_message_type" value="ContentItemSelection" />
			<input type="hidden" name="lti_version" value="LTI-1p0" />
			<input type="hidden" id="content_items" name="content_items" value="${escape(
				content_items.replace(/((\r\n|\n|\r)\t*)/gm, '')
			)}" />
			<input type="hidden" name="data" value="${escape(data)}" />
			<input type="hidden" name="oauth_version" value="1.0" />
			<input type="hidden" name="oauth_nonce" value="${escape(signature.params['oauth_nonce'])}" />
			<input type="hidden" name="oauth_timestamp" value="${escape(
				signature.params['oauth_timestamp']
			)}" />
			<input type="hidden" name="oauth_consumer_key" value="${escape(
				signature.params['oauth_consumer_key']
			)}" />
			<input type="hidden" name="oauth_callback" value="about:blank" />
			<input type="hidden" name="oauth_signature_method" value="HMAC-SHA1" />
			<input type="hidden" name="oauth_signature" value="${escape(
				signature.params['oauth_signature']
			)}" />
		</form>
		<script>
			document.forms[0].submit();
		</script>
		`
	};
}

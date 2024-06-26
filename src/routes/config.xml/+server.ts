import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const GET: RequestHandler = async () => {
	return new Response(`<?xml version="1.0" encoding="UTF-8"?>
		<cartridge_basiclti_link xmlns="http://www.imsglobal.org/xsd/imslticc_v1p0"
			xmlns:blti = "http://www.imsglobal.org/xsd/imsbasiclti_v1p0"
			xmlns:lticm ="http://www.imsglobal.org/xsd/imslticm_v1p0"
			xmlns:lticp ="http://www.imsglobal.org/xsd/imslticp_v1p0"
			xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance"
			xsi:schemaLocation = "http://www.imsglobal.org/xsd/imslticc_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticc_v1p0.xsd
			http://www.imsglobal.org/xsd/imsbasiclti_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imsbasiclti_v1p0.xsd
			http://www.imsglobal.org/xsd/imslticm_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticm_v1p0.xsd
			http://www.imsglobal.org/xsd/imslticp_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticp_v1p0.xsd">
		  <blti:title>${env.PUBLIC_TEST_ENV ? '(Dev) ' : ''}Icon selector</blti:title>
		  <blti:description>Insert accessible icons directly into pages in your Course</blti:description>
		  <blti:icon>${env.PUBLIC_ASSET_HOST}/favicon${env.PUBLIC_TEST_ENV ? '.dev' : ''}.png</blti:icon>
		  <blti:extensions platform="canvas.instructure.com">
			<lticm:property name="tool_id">icon_selector</lticm:property>
			<lticm:property name="privacy_level">public</lticm:property>
			<lticm:options name="editor_button">
			  <lticm:property name="message_type">ContentItemSelectionRequest</lticm:property>
			  <lticm:property name="url">${env.PUBLIC_ASSET_HOST}/</lticm:property>
			  <lticm:property name="text">${
					env.PUBLIC_TEST_ENV ? '(Dev) ' : ''
				}UoA Canvas Icons</lticm:property>
			  <lticm:property name="selection_width">800</lticm:property>
			  <lticm:property name="selection_height">700</lticm:property>
			  <lticm:property name="enabled">true</lticm:property>
			</lticm:options>
		  </blti:extensions>
		  <cartridge_bundle identifierref="BLTI001_Bundle"/>
		  <cartridge_icon identifierref="BLTI001_Icon"/>
		</cartridge_basiclti_link>`, {
		headers: {
			'content-type': 'text/xml; charset=utf-8'
		}
	});
};

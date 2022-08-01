// import { session } from '$app/stores';

/** @type {import('@sveltejs/kit').RequestHandler} */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function get({ params }) {
    const { colour } = params;
    // code goes here
    const assetHost = process.env.VITE_ASSET_HOST
    const stackURL = `${assetHost}/font/stack/svg/sprite.stack.svg`;
    console.log(stackURL, colour);
    const stack = await fetch(stackURL).then(res => res.text());
    // Set fill for the icon stack
    const colourStack = stack.replace("<svg ", `<svg fill="#${colour}" `);
    return {
        status: 200,
        body: colourStack,
        headers: {
            "Content-Type": "image/svg+xml"
        }
    };
  }
  
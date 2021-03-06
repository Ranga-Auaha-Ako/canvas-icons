> **NOTE: This project is still in BETA. Deployment is still a manual process, and you will need a [license from The Noun Project](https://thenounproject.com/pricing/) to use icons from our default repository without attribution.**

<!-- # Quick Links
 - [The Noun Project](https://thenounproject.com/)
----
 -->

# Technology & Infrastructure

This tool is split into two components for durability. One key advantage of this is that if the icon selector part of the tool goes down (or needs to be decomissioned in the future), then the icons can still be safely hosted at minimal cost.

## Icon Selector

The icon selector itself runs on [Svelte](https://svelte.dev/) using [SvelteKit](https://kit.svelte.dev/) with the [NodeJS Adapter](https://github.com/sveltejs/kit/tree/master/packages/adapter-node). This allows for a speedy "compiled" interface with no extra unused bits. As a pre-build step, the [icon repository](https://github.com/Ranga-Auaha-Ako/canvas-icons/tree/master/static/icons) is automatically crunched down into a single SVG sprite file using [svg-sprite](https://www.npmjs.com/package/svg-sprite).

## Icon Host

Because the icons are hosted with serverless architecture ([AWS Lambda](https://aws.amazon.com/lambda/) + [AWS API Gateway](https://aws.amazon.com/api-gateway/) + [AWS S3](https://aws.amazon.com/s3/)), there's little risk of massive student demand (e.g. around exam times) causing slowdowns, as this part of the tool can scale nearly instantly to handle additional load. The reason there's any compute happening here at all is because we need to transform the source SVG to allow custom colour choices. For example, `https://assets.canvasicons.auckland.ac.nz/colour/Teaching/noun_Magnifying_Glass_1142952.`**`01ABCD`**`.svg` loads icon `noun_Magnifying_Glass_1142952` from the `Teaching` category, and replaces the default `black` colour with `01ABCD`. It does this using a simple NodeJS Lambda function running through AWS's API Gateway.

# Developing

First, install [yarn](https://yarnpkg.com/) on your operating system of choice.

Once you've created a project and installed dependencies with `yarn install`), start a development server:

```bash
yarn run dev

# or start the server and open the app in a new browser tab
yarn run dev -- --open
```

You can test out all of the features of the icon selector, but choosing an icon will download it rather than send it to Canvas, similarly to how it does on the [live site](https://canvasicons.auckland.ac.nz/). If you would like to test integration with Canvas, use the "Paste XML" configuration type and copy + paste the XML from `./src/static/config.dev.xml` into the "XML Configuration" box. Choose a memorable name, and save it to a test course of your choosing. Hot reload is enabled, but hot-reloading while previewing in Canvas will discard the callback information required to save the icon. This means that you'll need to close and re-open the dialogue if you want to test that functionality.

## Building

This project is automatically built when pushed to master, and will appear for public use at [canvasicons.auckland.ac.nz](https://canvasicons.auckland.ac.nz/). To test the build process, use one of the following methods:

### With Docker

First, install [Docker Desktop](https://www.docker.com/get-started).

Run `docker compose -f .\docker-compose.prod.yml up`. A NodeJS server with the production build will start and be accessible at http://localhost:3000/.

### The traditional way

To build the project for testing the "production" output:`yarn run build`

> You can preview the built app with `yarn run preview`. This should _not_ be used to serve your app in production. You can host the app to be available to other devices on the network through `yarn run host-preview` (for testing the built app) and `yarn run host` (for testing with dev features enabled).

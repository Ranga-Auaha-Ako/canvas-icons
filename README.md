# Canvas Icons Selector

Built from [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

First, install [pnpm](https://pnpm.io/) on your operating system of choice.

Once you've created a project and installed dependencies with `pnpm install`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

You can test out all of the features of the icon selector, but choosing an icon will result in a 404 page as there is nothing to return to. If you would like to test integration with Canvas, use the "Paste XML" configuration type and copy + paste the XML from ./src/static/config.dev.xml into the "XML Configuration" box. Choose a memorable name, and save it to a test course of your choosing. Hot reload is enabled, but hot-reloading while previewing in Canvas will discard the callback information required to save the icon. This means that you'll need to close and re-open the dialogue if you want to test that functionality.

## Building

This project is automatically built when pushed to master, and will appear for public use at https://canvasicons.h.zac.nz/. To test the build process, use one of the following methods

### With Docker

First, install [Docker Desktop](https://www.docker.com/get-started).

Run `docker compose -f .\docker-compose.prod.yml up`. A NodeJS server with the production build will start and be accessible at http://localhost:3000/.

### The traditional way

To build the project for testing the "production" output:

```bash
npm run build
```

> You can preview the built app with `npm run preview`. This should _not_ be used to serve your app in production. You can host the app to be available to other devices on the network through `npm run host-preview` (for testing the built app) and `npm run host` (for testing with dev features enabled).

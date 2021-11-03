# Canvas Icons Selector

> **View latest documentation [here](https://ranga-auaha-ako.github.io/canvas-icons/)**

## Developing

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

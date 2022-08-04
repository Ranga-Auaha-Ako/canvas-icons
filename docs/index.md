---
youtube_video: lWnGr_oPOoU
---

> **NOTE: This project is still in BETA. Deployment is automated but requires manual configuring. You will also need to install the sibling repository tool here: **

<!-- # Quick Links
 - [The Noun Project](https://thenounproject.com/)
----
 -->

# Technology & Infrastructure

This tool is split into two components for durability. One key advantage of this is that if the icon selector part of the tool goes down (or needs to be decomissioned in the future), then the icons can still be safely hosted at minimal cost.

## Icon Selector

The icon selector itself runs on [Svelte](https://svelte.dev/) using [SvelteKit](https://kit.svelte.dev/) with the [NodeJS Adapter](https://github.com/sveltejs/kit/tree/master/packages/adapter-node). This allows for a speedy "compiled" interface with no extra unused bits. As a pre-build step, the [icon repository](https://github.com/Ranga-Auaha-Ako/canvas-icons/tree/master/static/icons) is automatically crunched down into a single SVG sprite file using [svg-sprite](https://www.npmjs.com/package/svg-sprite).

## Icon Library

Because the icons are hosted with serverless architecture ([AWS Lambda](https://aws.amazon.com/lambda/) + [AWS API Gateway](https://aws.amazon.com/api-gateway/) + [AWS S3](https://aws.amazon.com/s3/)), there's little risk of massive student demand (e.g. around exam times) causing slowdowns, as this part of the tool can scale nearly instantly to handle additional load. The reason there's any compute happening here at all is because we need to transform the source SVG to allow custom colour choices. For example, `https://assets.canvasicons.auckland.ac.nz/colour/Teaching/noun_Magnifying_Glass_1142952.`**`01ABCD`**`.svg` loads icon `noun_Magnifying_Glass_1142952` from the `Teaching` category, and replaces the default `black` colour with `01ABCD`. It does this using a simple NodeJS Lambda function running through AWS's API Gateway.

Icons are hosted using a separate stack from the repository at [Ranga-Auaha-Ako/canvas-icons-library](https://github.com/Ranga-Auaha-Ako/canvas-icons-library). This repository handles the bundling and generation of icon fonts, optimisation of icon assets, and houses the lambda script for transforming them in production.

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

This tool is built into a Docker image for deployment on AWS, and uses Terraform for configuration and deployment. Before starting, you will need to fork the repository or download and edit the `terraform.tf.json` file. Update the state management configuration to match the S3 Bucket you use, or remove it if you're just using local storage of Terraform state. You can also update the `aws_region` and `asset_host` variables to match your AWS region and the domain you are hosting the icon library on.

To build the image, run:

```bash
cd deployment
terraform apply # This will create and/or configure the required infrastructure on AWS. Careful! This will add to your bill.
./deploy.sh # This will build the image and push it to AWS
```

Canvas Icons runs on an AWS Beanstalk instance, which has lower priced options than a full ECS + load balancing configuration.

### With Docker

First, install [Docker Desktop](https://www.docker.com/get-started).

Run `docker compose -f .\docker-compose.prod.yml up`. A NodeJS server with the production build will start and be accessible at http://localhost:3000/.

### The traditional way

To build the project for testing the "production" output:`yarn run build`

> You can preview the built app with `yarn run preview`. This should _not_ be used to serve your app in production. You can host the app to be available to other devices on the network through `yarn run host-preview` (for testing the built app) and `yarn run host` (for testing with dev features enabled).

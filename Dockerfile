# Dockerfile
FROM node:14.16.1 AS dev

ENV NODE_ENV development

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "yarn.lock", "./"]
RUN yarn
COPY . .

# Expose port 3000 for the SvelteKit app and 24678 for Vite's HMR
EXPOSE 3000
EXPOSE 24678

CMD ["yarn", "dev", "--host", "0.0.0.0"]

FROM dev AS builder

RUN yarn build

FROM builder AS prod

# Expose port 3000 for the SvelteKit app and 24678 for Vite's HMR
EXPOSE 3000

CMD ["node", "build"]

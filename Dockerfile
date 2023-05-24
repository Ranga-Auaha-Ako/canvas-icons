# Dockerfile
FROM node:16.15.1 AS dev

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "yarn.lock", "./"]
RUN yarn
COPY . .

RUN yarn build

ENV PUBLIC_ASSET_HOST=$PUBLIC_ASSET_HOST
ENV PUBLIC_TEST_ENV=$PUBLIC_TEST_ENV

EXPOSE 3000
CMD ["node", "build"]

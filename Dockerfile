# Dockerfile
FROM node:16.15.1 AS dev

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "yarn.lock", "./"]
RUN yarn
COPY . .

RUN yarn build

ENV VITE_ASSET_HOST=$VITE_ASSET_HOST

EXPOSE 3000
CMD ["node", "build"]

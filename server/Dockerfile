FROM node:18.9.1

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
COPY .env.production .env

RUN pnpm build

ENV NODE_ENV production

CMD ["node", "dist/index.js"]

USER node

FROM node:current-alpine AS development
RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY package.json .npmrc ./

RUN pnpm install glob rimraf

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:current-alpine AS production

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json .npmrc ./

RUN pnpm install glob rimraf

RUN pnpm install --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]

FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

RUN mkdir -p data

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

COPY --from=builder /usr/src/app/src ./src

EXPOSE 8080


CMD [ "sh", "-c", "npm run seed && node dist/index.js" ]
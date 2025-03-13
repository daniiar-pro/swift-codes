FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY data ./data

RUN npm run build

EXPOSE 8080

CMD [ "sh", "-c", "npm run seed && npm run dev" ]
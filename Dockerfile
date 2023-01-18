FROM node:18-alpine

RUN apk update
RUN apk add openssl1.1-compat

WORKDIR /usr/src/app
COPY /package.json ./
COPY /prisma/ ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
EXPOSE 3000

CMD ["npm", "run", "start"]

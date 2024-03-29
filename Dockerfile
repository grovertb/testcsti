FROM node:20-alpine

WORKDIR /app

COPY package*.json .


RUN npm install \
  && npm list --depth=0

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main"]

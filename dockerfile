FROM node:current-alpine3.20
WORKDIR /app
COPY ./*.json ./
COPY ./*.js ./
COPY .editorconfig ./
COPY .env ./
COPY ./src ./src
RUN npm install
RUN npm i pm2 -g
EXPOSE 8080
CMD ["npm", "start"]


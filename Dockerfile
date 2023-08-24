FROM node:16
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
EXPOSE 6969
RUN npm run build
CMD [ "node", "dist/src/main.js" ]
FROM node:latest


WORKDIR /app
COPY package*.json .
RUN npm i
EXPOSE 4200
COPY . .
RUN npm install --save-dev @angular-devkit/build-angular
RUN npm i -g @angular/cli@15.1.6
RUN npm run build

CMD ["ng", "serve", "--host", "0.0.0.0"]

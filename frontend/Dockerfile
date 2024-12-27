FROM node:latest as builder

LABEL maintainer="l.nowosielski.680@studms.ug.edu.pl"

WORKDIR /app

USER 1000
COPY package*.json ./

USER 0
RUN npm ci

USER 1000
COPY . .

USER 0
RUN npm run build --production

FROM nginx:alpine

USER 1000
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

EXPOSE 80

USER 0
CMD ["nginx", "-g", "daemon off;"]
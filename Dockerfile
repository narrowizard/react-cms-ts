FROM node:latest as builder
WORKDIR /home/www
COPY . .
RUN npm i
RUN npm run build

FROM narrowizard/caddy:latest
WORKDIR /srv
COPY --from=builder /home/www/dist/ .
RUN rm -rf /etc/Caddyfile
VOLUME [ "/etc/Caddyfile" ]

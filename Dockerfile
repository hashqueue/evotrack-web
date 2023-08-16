FROM node:18.17.1-slim
COPY ./ /app
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com/ \
    && npm install \
    && npm run build

FROM nginx:alpine
RUN mkdir -p /app/static/media
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /app

ENTRYPOINT echo "Nginx service has been deployed." && nginx -g "daemon off;"

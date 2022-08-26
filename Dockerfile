## Dockerfile for nginx
FROM nginx:1.23.1-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY www /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"];
## Dockerfile for nginx
FROM nginx:1.27.0-alpine

USER root
RUN chown root:root /etc/shadow && chmod 600 /etc/shadow
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY www /usr/share/nginx/html/

ENV LANG=ko_KR.UTF-8 \
    LANGUAGE=ko_KR.UTF-8

# Set the timezone in docker
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
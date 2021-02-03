FROM nginx

COPY ./ /usr/share/nginx/html/
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
ADD ./nginx/server.crt /etc/nginx/server.crt
ADD ./nginx/server.key /etc/nginx/server.key


EXPOSE 80 443
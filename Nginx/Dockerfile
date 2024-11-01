FROM nginx:stable-alpine

COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY .htpasswd /etc/nginx/.htpasswd
COPY ./src/* /mysite/html/
COPY ./shutdown.sh /home/shutdown.sh
COPY ./run_shutdown_server.py /home/run_shutdown_server.py

RUN chmod +x /home/shutdown.sh
RUN apk add --no-cache python3

# Run the custom Python server and start Nginx
CMD /bin/sh -c "envsubst '\$NGINX_PORT' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf && python3 /home/run_shutdown_server.py & nginx -g 'daemon off;'"

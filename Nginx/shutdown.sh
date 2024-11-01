#!/bin/sh
# shutdown.sh

echo 'shutting down Nginx'
nginx_pid=$(cat /var/run/nginx.pid)
echo 'Nginx PID:' $nginx_pid
kill -TERM "$nginx_pid"
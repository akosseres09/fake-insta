#!/bin/sh

mkdir -p /var/log/nginx
mkdir -p /var/spool/rsyslog

rm -f /var/log/nginx/access.log /var/log/nginx/error.log
touch /var/log/nginx/access.log /var/log/nginx/error.log

rsyslogd

CONTAINER_NAME=$(hostname)
sed -i "s/Hostname=.*/Hostname=$CONTAINER_NAME/" /etc/zabbix/zabbix_agent2.conf
/usr/sbin/zabbix_agent2 &

echo "Starting Nginx..."
nginx -g 'daemon off;'
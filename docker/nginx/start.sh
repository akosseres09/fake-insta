#!/bin/sh

mkdir -p /var/log/nginx
mkdir -p /var/spool/rsyslog

rm -f /var/log/nginx/access.log /var/log/nginx/error.log
touch /var/log/nginx/access.log /var/log/nginx/error.log

rsyslogd

CONTAINER_NAME=$(hostname)
sed -i "s/Hostname=.*/Hostname=$CONTAINER_NAME/" /etc/zabbix/zabbix_agent2.conf
/usr/sbin/zabbix_agent2 &

iptables -F

iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

iptables -A INPUT -i lo -j ACCEPT

iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

iptables -A INPUT -p tcp --dport 80 -j ACCEPT

echo "Starting Nginx..."
nginx -g 'daemon off;'
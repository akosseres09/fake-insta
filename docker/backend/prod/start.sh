#!/bin/sh

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

iptables -A INPUT -p tcp --dport 3000 -j ACCEPT


pm2-runtime start dist/index.js --output /var/log/pm2/out.log --error /var/log/pm2/error.log
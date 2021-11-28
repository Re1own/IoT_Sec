#! /bin/sh
while [ 1 ]
do
	date;cat /proc/meminfo | grep "MemFree"; cat /proc/meminfo | grep "Cached";echo "=========================="
	udelay 5000
done

#!/bin/bash
while true
do 
	git fetch origin
	git pull origin master
	firebase deploy
	sleep 300
done

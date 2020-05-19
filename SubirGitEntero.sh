#!/bin/bash

if [ $# -eq 0 ]; then
	echo "Debe especificar un mensaje para el commit" >&2
else 
	git add .
	git commit -m "$1"
	git push origin master
fi


#!/bin/sh

if [ -z "$1" ]; then
		echo "Usage: ./run.sh filename"
		exit 1
elif [ -f $1 ];
		then
    echo "Using file: $1"
else
		echo "Sorry file $1 does not exist. Try again with a new filename or try creating with 'python generate_file $1 [number_of_lines]'"
		exit 1
fi

export TEST_FILE=$1

node app.js
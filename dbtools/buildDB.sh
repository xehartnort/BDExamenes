#!/bin/sh


db_default_path="../examenes.db"
db_update_path="/tmp"
create_db_script="./createDB.py"
update_db_script="./updateDB.py"
ocr_db_script="./ocrScan.py"
duplicates="./duplicates"

if [[ ! $PWD =~ "dbtools" ]]; then
	cd dbtools
	moved=yes
fi
 
if [[ ! -f $db_default_path ]]; then
	echo "$db_default_path was not found, creating a new one"
	$create_db_script
else
	mv $db_default_path $db_update_path
	echo "Updating: $db_update_path"
fi


$update_db_script

if [[ -f $duplicates ]]; then
	echo "Duplicated files found"
	IFS=$'\n' # input file separator
	for i in $(cat duplicates) 
	do 	
		rm $i && echo "deleted: $i"
	done
	rm $duplicates
fi

# $ocr_db_script

if [[ $moved == "yes" ]]; then
	cd ..
fi

if [[ -f "/tmp/examenes.db" ]]; then
	mv '/tmp/examenes.db' '.'
fi

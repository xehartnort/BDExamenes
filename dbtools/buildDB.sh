#!/bin/sh


db_default_path="../examenes.db"
create_db_script="./createDB.py"
update_db_script="./updateDB.py"
duplicates="./duplicates"

if [[ ! $PWD =~ "dbtools" ]]; then
	cd dbtools
	moved=yes
fi
 
if [[ ! -f $db_default_path ]]; then
	echo "$db_default_path was not found, creating a new one"
	$create_db_script
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

if [[ $moved == "yes" ]]; then
	cd ..
fi


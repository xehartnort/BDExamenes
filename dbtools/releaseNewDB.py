#!/usr/bin/python3 -OO
# -*- coding: utf-8 -*-
from peewee import *
import subprocess
import sys

if(len(sys.argv) != 3):
	print("Missing args: oldDBfile newDBfile")
	sys.exit()

oldDBfile = sys.argv[1]
newDBfile = sys.argv[2]

MySQLitedb = SqliteDatabase(newDBfile)

class Tag(Model):
    nom_tag = CharField(null = False,
                    primary_key = True)
    tipo_tag = CharField(null = False,
                    constraints=[Check("tipo_tag in ('anio', 'curso', 'asig', 'grado', 'apuntes')")] )
    preferencia = IntegerField(default=0) # incrementa con cada visita
    class Meta:
        database = MySQLitedb # this model is in *.db database

# subprocess.call(['sqlite3', oldDBfile, '"SELECT nom_tag,preferencia FROM tag WHERE preferencia>0"', '>','out.txt'])
with open('out.txt', "r") as File:
	for line in File:
		values = line.split("|")
		query = Tag.update(preferencia=values[1]).where(Tag.nom_tag==values[0])
		query.execute()
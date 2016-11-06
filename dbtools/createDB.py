#!/usr/bin/env python
# -*- coding: utf-8 -*-
#Thing 	Corresponds to...
#Model class    ->  Database table
#Field instance ->  Column on a table
#Model instance ->  Row in a database table

from peewee import *
import os
import hashlib

MySQLitedb = SqliteDatabase('../examenes.db')

class Documento(Model):
    id_doc = FixedCharField(null = False,
                    primary_key = True,
                    max_length = 40) # sha1
    nom_doc = CharField(null = False)
    ruta_doc = TextField(null = False)
    class Meta:
        database = MySQLitedb # this model is in *.db database

class Tag(Model):
    nom_tag = CharField(null = False,
                    primary_key = True)
    tipo_tag = CharField(null = False,
                    constraints=[Check("tipo_tag in ('anio', 'curso', 'asig', 'grado', 'otro')")])
    preferencia = IntegerField(default=0) # incrementa con cada visita
    class Meta:
        database = MySQLitedb # this model is in *.db database

class DocTag(Model):
    id_doc = ForeignKeyField(Documento, related_name='documentos')
    nom_tag = ForeignKeyField(Tag, related_name='tags')
    ver = BooleanField(default = True)
    class Meta:
        primary_key = CompositeKey('id_doc', 'nom_tag')
        database = MySQLitedb # this model is in *.db database

MySQLitedb.create_tables([Documento, Tag, DocTag])
MySQLitedb.execute_sql("CREATE VIEW examen AS SELECT A.nom_doc, A.ruta_doc, B.nom_tag_id FROM documento AS A INNER JOIN doctag AS B ON A.id_doc=B.id_doc_id")
#MySQLitedb.close()

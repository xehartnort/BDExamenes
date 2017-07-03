#!/usr/bin/python3 -OO
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
                    max_length = 32) # md5
    nom_doc = CharField(null = False)
    ruta_doc = TextField(null = False)
    class Meta:
        database = MySQLitedb # this model is in *.db database

class Tag(Model):
    nom_tag = CharField()
    tipo_tag = CharField(constraints=[Check("tipo_tag in ('anio', 'curso', 'asig', 'grado')")] )
    preferencia = IntegerField(default=0) # incrementa con cada visita
    class Meta:
        primary_key = CompositeKey('nom_tag', 'tipo_tag')
        database = MySQLitedb # this model is in *.db database

class DocTag(Model):
    id_doc = ForeignKeyField(Documento, related_name='documentos')
    nom_tag = ForeignKeyField(Tag, to_field="nom_tag", related_name='nom_tags')
    comprobado = BooleanField(default = True) 
    class Meta:
        primary_key = CompositeKey('id_doc', 'nom_tag')
        database = MySQLitedb # this model is in *.db database

class InfoAsig(Model):
    asig = ForeignKeyField(Tag, to_field="nom_tag", related_name='tagAsig')
    curso = ForeignKeyField(Tag, to_field="nom_tag", related_name='tagCurso')
    grado = ForeignKeyField(Tag, to_field="nom_tag", related_name='tagGrado')
    class Meta:
        primary_key = CompositeKey('asig', 'curso', 'grado')
        database = MySQLitedb # this model is in *.db database

MySQLitedb.create_tables([Documento, Tag, DocTag, InfoAsig])
MySQLitedb.execute_sql("CREATE VIEW examen AS SELECT A.nom_doc, A.ruta_doc, A.id_doc, B.nom_tag_id, B.comprobado, C.tipo_tag, C.preferencia FROM doctag AS B INNER JOIN documento AS A ON A.id_doc=B.id_doc_id INNER JOIN tag AS C ON C.nom_tag=B.nom_tag_id")
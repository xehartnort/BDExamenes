#!/usr/bin/python3 -OO
# -*- coding: utf-8 -*-

from peewee import *
import peewee
import os
import hashlib
import re

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

'''
    path = path to file
    block_size = block size of your filesystem
'''
def hash_file(path, block_size=4096):
    hash_string = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(block_size*4), b''):
            hash_string.update(chunk)
    return hash_string.hexdigest()

def fill_existing_tags(tipo_tag):
    tags=[]
    for i in Tag.select().where(Tag.tipo_tag==tipo_tag):
        tags+= [i.nom_tag]
    return tags

dgiim_cursos = [0]*4
dgiim_cursos[0] = ["Fundamentos de Software", "Lógica y Métodos Discretos",
        "Tecnología y Organización de Computadores", "Metodología de la Programación",
        "Fundamentos Físicos y Tecnológicos"]
dgiim_cursos[1] =["Estructura de Computadores","Estructura de Datos","Sistemas Operativos",
        "Programación y Diseño Orientado a Objetos","Arquitectura de Computadores","Algorítmica"]
dgiim_cursos[2] = ["Sistemas Concurrentes y Distribuidos",
    "Fundamentos de Bases de Datos","Inteligencia Artificial",
    "Fundamentos de Ingeniería del Software","Fundamentos de Redes",
    "Modelos de Computación", "Ingeniería de Servidores"]
dgiim_cursos[3] = ["Informática Gráfica","Diseño y Desarrollo de Sistemas de Información"]

anios=fill_existing_tags("anio")
cursos=fill_existing_tags("curso")
asigs=fill_existing_tags("asig")
grados=fill_existing_tags("grado")
num2word=["","primero", "segundo", "tercero", "cuarto", "quinto"]

for (dirpath, dirnames, files) in os.walk(".."):
    if "exámenes/" in dirpath and files: # folder exámenes and files not empty
        tags_insert = []
        infoasig_insert = []
        tags = dirpath.split('/')
        print(tags)
        grado = tags[2]
        curso = tags[3]
        asig = tags[4]
        if len(tags)==6: # [.., exámenes, Informática y Matemáticas, 1, Cálculo II, 1314]
            anio = tags[5]
        else: # [.., exámenes, Informática y Matemáticas, 1, Cálculo II]
            anio = None
        if anio not in anios and anio is not None:
            anios += [anio]
            tags_insert += [{'nom_tag':anio, 'tipo_tag':'anio'}]
        if curso not in cursos:
            cursos += [curso]
            tags_insert += [{'nom_tag':num2word[int(curso)], 'tipo_tag':'curso'}]
            tags_insert += [{'nom_tag':curso, 'tipo_tag':'curso'}]
        if grado not in grados:
            grados += [grado]
            tags_insert += [{'nom_tag':grado, 'tipo_tag':'grado'}]
        if asig not in asigs:
            asigs += [asig]
            tags_insert += [{'nom_tag':asig, 'tipo_tag':'asig'}]
            infoasig_insert += [{'asig':asig, 'curso':curso, 'grado':grado}]
            infoasig_insert += [{'asig':asig, 'curso':num2word[int(curso)], 'grado':grado}]
            for i in range(1, len(dgiim_cursos)+1):
                if asig in dgiim_cursos[i-1]:
                    infoasig_insert += [{'asig':asig, 'curso':num2word[int(curso)], 'grado':'Informática y Matemáticas'}]
                    if curso != str(i):
                        infoasig_insert += [{'asig':asig, 'curso':num2word[i], 'grado':'Informática y Matemáticas'}]
                        infoasig_insert += [{'asig':asig, 'curso':i, 'grado':'Informática y Matemáticas'}]
        with MySQLitedb.atomic():
            if tags_insert:
                Tag.insert_many(tags_insert).execute()
            if infoasig_insert:
                InfoAsig.insert_many(infoasig_insert).execute()
        for filename in files:
            if filename != ".empty":
                hashed = hash_file(dirpath+"/"+filename)
                docs = [{'id_doc':hashed, 'nom_doc':filename, 'ruta_doc':dirpath[3:]}]
                doc_tags = [{'id_doc':hashed, 'nom_tag':anio}, 
                            {'id_doc':hashed, 'nom_tag':asig},
                            {'id_doc':hashed, 'nom_tag':curso},
                            {'id_doc':hashed, 'nom_tag':num2word[int(curso)]}, 
                            {'id_doc':hashed, 'nom_tag':grado}]
                for i in range(1, len(dgiim_cursos)+1):
                    if asig in dgiim_cursos[i-1]:
                        doc_tags += [{'id_doc':hashed, 'nom_tag':'Informática y Matemáticas'}]
                        if curso != str(i):
                            doc_tags += [{'id_doc':hashed, 'nom_tag':num2word[i]}]
                            doc_tags += [{'id_doc':hashed, 'nom_tag':i}]
                try:
                    with MySQLitedb.atomic():
                        Documento.insert_many(docs).execute()
                        DocTag.insert_many(doc_tags).execute()
                except peewee.IntegrityError as e:
                    i=Documento.select().where(Documento.id_doc==hashed)[0]
                    if(dirpath[3:]+"/"+filename != i.ruta_doc+"/"+i.nom_doc):
                        with open('duplicates', 'a') as the_file:
                            path = dirpath+"/"+filename
                            the_file.write(path+"\n")
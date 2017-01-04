#!/usr/bin/python -O
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
    nom_tag = CharField(null = False,
                    primary_key = True)
    tipo_tag = CharField(null = False,
                    constraints=[Check("tipo_tag in ('anio', 'curso', 'asig', 'grado', 'otro')")])
    #preferencia = IntegerField(default=0) # incrementa con cada visita
    class Meta:
        database = MySQLitedb # this model is in *.db database

class DocTag(Model):
    id_doc = ForeignKeyField(Documento, related_name='documentos')
    nom_tag = ForeignKeyField(Tag, related_name='tags')
    comprobado = BooleanField(default = True) 
    class Meta:
        primary_key = CompositeKey('id_doc', 'nom_tag')
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

def getSigla(tag):
    dupla=[]
    regex = re.compile("[A-Z]|Á")
    capitals=""
    matches = regex.findall(tag)
    if len(matches)>1:
        for j in matches:
            capitals+=j.replace("Á","A")
    return capitals

primero_dgiim = ["Fundamentos de Software", "Lógica y Métodos Discretos",
        "Tecnología y Organización de Computadores", "Metodología de la Programación",
        "Fundamentos Físicos y Tecnológicos"]
segundo_dgiim =["Estructura de Computadores","Estructura de Datos","Sistemas Operativos",
        "Programación y Diseño Orientado a Objetos","Arquitectura de Computadores","Algorítmica"]
tercero_dgiim = ["Sistemas Concurrentes y Distribuidos",
    "Fundamentos de Bases de Datos","Inteligencia Artificial",
    "Fundamentos de Ingeniería del Software","Fundamentos de Redes",
    "Modelos de Computación", "Ingeniería de Servidores"]
cuarto_dgiim = ["Informática Gráfica","Diseño y Desarrollo de Sistemas de Información"]
quinto_dgiim = []

anios=fill_existing_tags("anio")
cursos=fill_existing_tags("curso")
asigs=fill_existing_tags("asig")
grados=fill_existing_tags("grado")
siglas=[]

num2word=["","primero", "segundo", "tercero", "cuarto", "quinto"]

for (dirpath, dirnames, files) in os.walk(".."):
    if "exámenes/" in dirpath and files: # folder exámenes and files not empty
        tags_insert = []
        doc_tags = []
        docs =[]
        tags = dirpath.split('/') # ../exámenes/Informática y Matemáticas/1/Cálculo II/1314
        anio = tags[-1]
        asig = tags[-2]
        curso = tags[-3]
        grado = tags[-4]
        if anio not in anios: #check if not inserted
            anios += [anio]
            tags_insert += [{'nom_tag':anio, 'tipo_tag':'anio'}]
        if asig not in asigs:
            asigs += [asig]
            # sigla = getSigla(asig)
            # if sigla not in siglas:
            #     siglas += [sigla]
            #     tags_insert += [{'nom_tag':sigla, 'tipo_tag':'asig'}]
            tags_insert += [{'nom_tag':asig, 'tipo_tag':'asig'}]
        if curso not in cursos:
            cursos += [curso]
            tags_insert += [{'nom_tag':num2word[int(curso)], 'tipo_tag':'curso'}]
        if grado not in grados:
            grados += [grado]
            tags_insert += [{'nom_tag':grado, 'tipo_tag':'grado'}]
        for filename in files:
            hashed = hash_file(dirpath+"/"+filename)
            docs += [{'id_doc':hashed, 'nom_doc':filename, 'ruta_doc':dirpath[3:]}]
            doc_tags += [{'id_doc':hashed, 'nom_tag':anio}, 
                        {'id_doc':hashed, 'nom_tag':asig},
                        {'id_doc':hashed, 'nom_tag':num2word[int(curso)]}, 
                        {'id_doc':hashed, 'nom_tag':grado}]
            if asig in primero_dgiim:
                doc_tags += [{'id_doc':hashed, 'nom_tag':'Informática y Matemáticas'}]
                if curso != '1':
                    doc_tags += [{'id_doc':hashed, 'nom_tag':'primero'}]
            if asig in segundo_dgiim:
                doc_tags += [{'id_doc':hashed, 'nom_tag':'Informática y Matemáticas'}]
                if curso != '2':
                    doc_tags += [{'id_doc':hashed, 'nom_tag':'segundo'}]
            if asig in tercero_dgiim:
                doc_tags += [{'id_doc':hashed, 'nom_tag':'Informática y Matemáticas'}]
                if curso != '3':
                    doc_tags += [{'id_doc':hashed, 'nom_tag':'tercero'}]
            if asig in cuarto_dgiim:
                doc_tags += [{'id_doc':hashed, 'nom_tag':'Informática y Matemáticas'}]
                if curso != '4':
                    doc_tags += [{'id_doc':hashed, 'nom_tag':'cuarto'}]
            # if asig in quinto_dgiim:
            #     doc_tags.append({'id_doc':hashed, 'nom_tag':'Informática y Matemáticas'})
            #     if curso != '5':
            #         doc_tags.append({'id_doc':hashed, 'nom_tag':'quinto'})
        try:
            with MySQLitedb.atomic():
                if tags_insert:
                    Tag.insert_many(tags_insert).execute()
                Documento.insert_many(docs).execute()
                DocTag.insert_many(doc_tags).execute()
        except peewee.IntegrityError as e:
            i=Documento.select().where(Documento.id_doc==hashed)[0]
            if(dirpath[3:]+"/"+filename != i.ruta_doc+"/"+i.nom_doc):
                with open('duplicates', 'a') as the_file:
                    path = dirpath+"/"+filename
                    the_file.write(path+"\n")
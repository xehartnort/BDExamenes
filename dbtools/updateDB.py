#!/usr/bin/env python
# -*- coding: utf-8 -*-

from peewee import *
import peewee
import os
import hashlib

MySQLitedb = SqliteDatabase('../examenes.db')

'''
    path = path to file
    block_size = block size of your filesystem
'''
def sha1_file(path, block_size=4096):
    sha = hashlib.sha1()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(block_size*4), b''):
            sha.update(chunk)
    return sha.hexdigest()

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

def fill_existing_tags(tipo_tag):
    tags=[]
    for i in Tag.select().where(Tag.tipo_tag==tipo_tag):
        tags.append(i.nom_tag)
    return tags

anios=fill_existing_tags("anio")
cursos=fill_existing_tags("curso")
asigs=fill_existing_tags("asig")
grados=fill_existing_tags("grado")

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

num2word=["","primero", "segundo", "tercero", "cuarto", "quinto"]

for (dirpath, dirnames, files) in os.walk(".."):
    if dirpath[-4:] in ["1112","1213","1314","1415","1516","ANTE","UNKN"]:
        with MySQLitedb.atomic():
            anio = dirpath[-4:]
            cdirpath = dirpath[:-5]
            if anio not in anios:
                anios.append(anio)
                Tag.insert(nom_tag=anio, tipo_tag="anio").execute()
            asig=""
            while cdirpath[-1] != "/":
                asig += cdirpath[-1]
                cdirpath = cdirpath[:-1]
            asig = asig[::-1] #reverse string
            if asig not in asigs:
                asigs.append(asig)
                Tag.insert(nom_tag=asig, tipo_tag="asig").execute()
            curso = cdirpath[-2]
            if curso not in cursos:
                cursos.append(curso)
                Tag.insert(nom_tag=num2word[int(curso)], tipo_tag="curso").execute()
            cdirpath = cdirpath[:-3]
            grado = ""
            while cdirpath[-1] != "/":
                grado += cdirpath[-1]
                cdirpath = cdirpath[:-1]
            grado = grado[::-1] #reverse string
            if grado not in grados:
                grados.append(grado)
                Tag.insert(nom_tag=grado, tipo_tag="grado").execute()
            for filename in files:
                sha1 = sha1_file(dirpath+"/"+filename)
                try:
                    Documento.insert(id_doc=sha1, nom_doc=filename,
                                    ruta_doc=dirpath[3:]).execute()
                    doc_tags = [{'id_doc':sha1, 'nom_tag':anio},
                            {'id_doc':sha1, 'nom_tag':asig},
                            {'id_doc':sha1, 'nom_tag':num2word[int(curso)]},
                            {'id_doc':sha1, 'nom_tag':grado}]
                    if asig in primero_dgiim:
                        doc_tags.append({'id_doc':sha1, 'nom_tag':'Matemáticas e Informática'})
                        if curso != '1':
                            doc_tags.append({'id_doc':sha1, 'nom_tag':'primero'})
                    if asig in segundo_dgiim:
                        doc_tags.append({'id_doc':sha1, 'nom_tag':'Matemáticas e Informática'})
                        if curso != '2':
                            doc_tags.append({'id_doc':sha1, 'nom_tag':'segundo'})
                    if asig in tercero_dgiim:
                        doc_tags.append({'id_doc':sha1, 'nom_tag':'Matemáticas e Informática'})
                        if curso != '3':
                            doc_tags.append({'id_doc':sha1, 'nom_tag':'tercero'})
                    if asig in cuarto_dgiim:
                        doc_tags.append({'id_doc':sha1, 'nom_tag':'Matemáticas e Informática'})
                        if curso != '4':
                            doc_tags.append({'id_doc':sha1, 'nom_tag':'cuarto'})
                    if asig in quinto_dgiim:
                        doc_tags.append({'id_doc':sha1, 'nom_tag':'Matemáticas e Informática'})
                        if curso != '5':
                            doc_tags.append({'id_doc':sha1, 'nom_tag':'quinto'})
                    DocTag.insert_many(doc_tags).execute()
                except peewee.IntegrityError as e:
                    print(e)
                #print("The attempted value is: "+sha1+" "+dirpath[2:]+"/"+filename)
                #for i in Documento.select().where(Documento.id_doc==sha1):
                #    print("The existing value is: "+i.ruta_doc+"/"+i.nom_doc)

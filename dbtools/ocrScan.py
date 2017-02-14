#!/usr/bin/python3 -OO
# -*- coding: utf-8 -*-

from PIL import Image
from peewee import *
from pyocr import tesseract
import subprocess
import os
import json
import re

MySQLitedb = SqliteDatabase('/tmp/examenes.db')

class Documento(Model):
    id_doc = FixedCharField(null = False,
                    primary_key = True,
                    max_length = 32) # sha1
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

def format2tif(name):
    subprocess.call(['gm', 'convert', '-crop', '100x20%', '-units', 'PixelsPerInch',
                '-density','204x196', name, "/tmp/out.tif"])
    return '/tmp/out.tif'

def getTags(tipo_tag):
    tags=[]
    for i in Tag.select().where(Tag.tipo_tag==tipo_tag):
        tags.append(i.nom_tag)
    tags.sort(key=len, reverse=True) # greater to lower
    return tags

def getSiglas(tags):
    siglas={}
    dupla=[]
    regex = re.compile("[A-Z]|Á")
    for i in tags:
        capitals=""
        matches = regex.findall(i)
        if len(matches)>1:
            for j in matches:
                capitals+=j.replace("Á","A")
            siglas[i] =capitals
    return siglas

def ocrScan(fil):
    img_tif = format2tif(fil+"[0]")
    im=Image.open(img_tif)
    txt = tesseract.image_to_string( im, lang="spa" )
    return txt;

asigs = getTags("asig")
asigSiglas = getSiglas(asigs) 
firstTerm =  ["oct","nov","dic"]
secondTerm= ["ene","feb","mar","abr","may","jun","jul","sep"]
anios = [str(i) for i in range(2011, 2017)] 

for (dirpath, dirnames, files) in os.walk("../sinClasificar"):
    for filename in files:
        if filename[-4:] in [".pdf", ".PDF"]:
            fpath = dirpath+"/"+filename
            print("Processing file: "+fpath+" ...")
            txt = ocrScan(fpath)
            data={}
            thereIsAsig=False
            thereIsMes=False
            matchedAnio=[]
            for asig in asigs:
                if thereIsAsig: 
                    break
                pattern=asig.replace(" ", "\W+").replace("á", "(a|á)").replace("é", "(e|é)").replace("í", "(i|í)").replace("ó", "(o|ó)")
                if re.search(pattern, txt):
                    thereIsAsig = True
                    data['asig'] = asig
                elif asig in asigSiglas: # has asigSiglas key asig?
                    if re.search("\s"+asigSiglas[asig]+"\s",txt) or re.search(asigSiglas[asig],filename):
                        thereIsAsig = True
                        data['asig'] = asig
            if thereIsAsig:
                for anio in anios:
                    if anio in txt or anio[2:] in filename:
                        matchedAnio.append(int(anio[2:]))
                if len(matchedAnio) > 1:
                    anio = matchedAnio[0]
                    if(matchedAnio[0] < matchedAnio[1]):
                        data['anio'] = str(anio) + str(anio+1) 
                    else:
                        data['anio'] = str(anio-1) + str(anio)
                elif len(matchedAnio)==1:
                    for mes in firstTerm+secondTerm:
                        if thereIsMes: 
                            break
                        if re.search(mes+"([iortuz][beiorl])*", txt, re.IGNORECASE) or re.search(mes, filename, re.IGNORECASE):
                            thereIsMes = True
                            anio = matchedAnio[0]
                            if mes in firstTerm:
                                data['anio'] = str(anio) + str(anio+1)
                            else: 
                                data['anio']= str(anio-1) + str(anio)                                                 
            print(data)
            #insertar en la BD
            # if( anio in data ):
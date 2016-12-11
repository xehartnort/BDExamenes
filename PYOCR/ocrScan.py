#!/usr/bin/python -OO
# -*- coding: utf-8 -*-

from PIL import Image
from peewee import *
from pyocr import tesseract
#from pyocr import cuneiform
import subprocess
import os
import json
import re

MySQLitedb = SqliteDatabase('examenes.db')

class Tag(Model):
    nom_tag = CharField(null = False,
                    primary_key = True)
    tipo_tag = CharField(null = False,
                    constraints=[Check("tipo_tag in ('anio', 'curso', 'asig', 'grado', 'otro')")])
    class Meta:
        database = MySQLitedb # this model is in *.db database

def format2tif(name):
    subprocess.call(['gm', 'convert', '-crop', '100x25%', '-units','PixelsPerInch',
                '-density','204x196', name, "./out.tif"])
    return 'out.tif'

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
    #print(siglas)
    return siglas

def ocrScan(fil):
    img_tif = format2tif(fil+"[0]")
    im=Image.open(img_tif)
    txt = tesseract.image_to_string( im, lang="spa" )
    #os.remove(img_tif)
    return txt;

asigs = getTags("asig")
asigSiglas = getSiglas(asigs) 
firstTerm =  ["oct","nov","dic"]
secondTerm= ["ene","feb","mar","abr","may","jun","jul","sep"]
fecha="\d{1,2}\W\d{1,2}\W\d{2,4}"
anios=[str(i) for i in range(2012, 2016)] 

exito=0
exitoParcial=0
total=0

for (dirpath, dirnames, files) in os.walk("../exámenes"):
    for fil in files:
        if fil[-4:] in [".pdf", ".PDF"] and 'ANTE' not in dirpath and 'UNKN' not in dirpath:
            total+=1
            fpath = dirpath+"/"+fil
            print("Processing file: "+fpath+" ...")
            txt = ocrScan(fpath)
            #print("I found: " +txt+"\n")
            data={}
            thereIsAsig=False
            thereIsMes=False
            matchedAnio=[]
            for asig in asigs:
                if thereIsAsig: break
                pattern=asig.replace(" ", "\W+").replace("á", "(a|á)").replace("í", "(i|í)").replace("ó", "(o|ó)").replace("é", "(e|é)")
                if re.search(pattern,txt,re.IGNORECASE):
                    thereIsAsig = True
                    data['asig'] = asig
                elif asig in asigSiglas: # has asigSiglas key asig?
                    if re.search("\s"+asigSiglas[asig]+"\s",txt) or re.search(asigSiglas[asig],fil):
                        thereIsAsig = True
                        data['asig'] = asig
            if thereIsAsig:
                exitoParcial+=1
                if found=re.findall(fecha,txt): #2/1/2016
                    data['anio']=""
                    while found[0][-1] != "/": #2/1/
                        data['anio'] += found[0][-1]
                        found[0] = found[0][:-1]
                    found[0] = found[0][:-1]
                    mes=""
                    while found[0][-1] != "/": #2/
                        mes += found[0][-1]
                        found[0] = found[0][:-1]
                    anio=data['anio'][-2:]
                    if int(mes)>9:
                        data['anio'] = anio + str(int(anio)+1)
                    else:
                        data['anio'] = str(int(anio)-1)+anio
                    exito+=1
                    print(json.dumps(data))
                    break
                for anio in anios:
                    #if thereIsAnio: break
                    if anio in txt or anio in fil:
                        matchedAnio.append(anio[2:])
                if len(matchedAnio) >= 2:
                    if(int(matchedAnio[0]) < int(matchedAnio[1])):
                        data['anio'] = matchedAnio[0] + matchedAnio[1] 
                    else:
                        data['anio'] = matchedAnio[1] + matchedAnio[0]
                    exito+=1
                    print(json.dumps(data))
                elif matchedAnio:
                    for mes in firstTerm+secondTerm:
                        if thereIsMes: break
                        if re.search(mes+"[iortuz][beiorl]*",txt,re.IGNORECASE) or re.search(mes,fil,re.IGNORECASE):
                            anio = int(matchedAnio[0])
                            thereIsMes = True
                            if mes in firstTerm:
                                data['anio'] = str(anio) + str(anio+1)
                            else: 
                                data['anio']= str(anio-1) + str(anio)
                            if data['anio'] in dirpath: exito+=1                                                  
                            print(json.dumps(data))
                    # with open(fpath+'.json', 'a') as output:
                    #     output.write(json.dumps(data))
            # else:
            #     with open('/home/xehartnort/BD/PYOCR/failed.txt', 'a') as output:
            #         output.write(fpath+'\n')        

print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
print("Éxitos: "+str(exito))
print("Éxitos parciales: "+str(exitoParcial))
print("Total: "+str(total))
print("% éxitos: "+str(exito/total*100))
print("% éxitos parciales: "+str(exitoParcial/total*100))
print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

#!/usr/bin/python
from PIL import Image
from peewee import *
import subprocess
import os
import json
from pyocr import tesseract

MySQLitedb = SqliteDatabase('../examenes.db')

class Tag(Model):
    nom_tag = CharField(null = False,
                    primary_key = True)
    tipo_tag = CharField(null = False,
                    constraints=[Check("tipo_tag in ('anio', 'curso', 'asig', 'grado', 'otro')")])
    preferencia = IntegerField(default=0) # incrementa con cada visita
    class Meta:
        database = MySQLitedb # this model is in *.db database

def format2tif(name):
    subprocess.call(['gm', 'convert', '-units','PixelsPerInch',
                '-density','204x196', name, name+'.tif'])

def chopImage(im_name, parts=4):
    with Image.open(im_name) as im:
        w, h = im.size
        im.crop((0, 0, w, h/parts)).save(im_name) #  left, upper, right, and lower


def getTags(tipo_tag):
    tags=[]
    for i in Tag.select().where(Tag.tipo_tag==tipo_tag):
        tags.append(i.nom_tag.lower())
    tags.sort(key=len, reverse=True)
    return tags

def proccessPDF(fil):
    # open pdf in order to know how many pages it has
    #with open(fil,'rb') as pdf:
    #    size = PdfFileReader(pdf).getNumPages()
    #txt="";
    #for i in range(0, size):
    img = fil+"["+str(0)+"]"
    format2tif(img)
    img_tif = img+'.tif'
    chopImage(img_tif)
    txt = tesseract.image_to_string( Image.open(img_tif), lang="spa" )
    os.remove(img_tif)
    return txt;

asigs = getTags("asig")
anios=[]
for i in range(2000,2016): anios.append(str(i))
meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
            'septiembre', 'octubre', 'noviembre', 'diciembre']

grados = ['matemáticas', 'telecomunicaciones', 'informática']
for (dirpath, dirnames, files) in os.walk("./test_set"):
    for fil in files:
        if fil[-4:] == ".pdf": # only .pdf files
            fpath = dirpath+"/"+fil
            print("Processing file: "+fpath+" ...")
            txt = proccessPDF(fpath).lower()
            matched=""
            data={}
            for i in asigs:
                if len(i) > len(matched):
                    if i in txt:
                        matched = i
                        data['asig'] =i
            for i in anios:
                if i in txt:
                    data['anio']=i
            for i in meses:
                if i in txt:
                    data['mes']=i
            for i in grados:
                if i in txt:
                    if ( matched=="matemáticas" and i=="informática" ) or ( matched=="informática" and i=="matemáticas" ):
                        data['grado']="matemáticas "+"informática"
                    else:
                        matched=i
                        data['grado']=i
            if 'asig' in data and 'anio' in data and 'mes' in data:
                print(json.dumps(data))
                with open(fpath+'.json', 'a') as output:
                    output.write(json.dumps(data))

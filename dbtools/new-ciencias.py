#/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import tabula as t
import os
import re

def multireplace(string, replacements):
    """
    Given a string and a replacement map, it returns the replaced string.
    :param str string: string to execute replacements on
    :param dict replacements: replacement dictionary {value to find: value to replace}
    :rtype: str
    """
    # Place longer ones first to keep shorter substrings from matching where the longer ones should take place
    # For instance given the replacements {'ab': 'AB', 'abc': 'ABC'} against the string 'hey abc', it should produce
    # 'hey ABC' and not 'hey ABc'
    substrs = sorted(replacements, key=len, reverse=True)

    # Create a big OR regex that matches any of the substrings to replace
    regexp = re.compile('|'.join(map(re.escape, substrs)))

    # For each match, look up the new string in the replacements
    return regexp.sub(lambda match: replacements[match.group(0)], string)

def createDir(diretory):
	if not os.path.exists(directory):
		os.makedirs(directory)

def createEmptyFile(fil):
	open(fil, 'w').close()

replacements ={"Q.":"Química", "Lab.":"Laboratorio", "SIST.":"Sistemas", "INFORM.":"Información", 
		"CART.":"Cartografía", "GEST.":"Gestión", "REC.":"Recursos", "TELED.":"Reledetección", 
		"TELEM.":"Telemática", "TEC.":"técnicas", "REC. DE":"Recuperación de", "CONS.":"Conservación",
		"COSERV":"Conservación", "SOCIOLOGIÍA":"Sociología", "PLANIFICAC.":"Planificación", "-": " ",
		"MICROBIOL.Y TÉC.AMB.APLIC.INFRAEST DE AGUAS Y RESI" : "Microbiología y Técnicas Ambientales Aplicadas a las Infraestructuras de Aguas y Residuos",
		"RECURSOS FORESTALES Y REST AMBIENTAL ÁREAS DEG.":"Recursos Forestales y Restauración Ambiental de Áreas Degradadas",
		"INVEST SOCIAL Y PARTICIPACIÓN EN MEDIO AMBIENTE":"Investigación Social y Participación en Medio Ambiente",
		"AGEN FÍSICOS, SALUD Y GESTIÓN DE RESIDUOS RADIOACT":"Agentes Físicos, Salud y Gestión de Residuos Radioactivos",
		"RECURSOS NAT": "Recursos Naturales", "INGENIERIA GEOL":"Ingeniería Geológica", "CARTOGRAFIA GEOL II Y SIG":"Cartografía Geológica II y Sismografía"}
r2 = {" Iii":" III", " Ii":" II", " Iv":" IV"}
basedir = "../exámenes"
if len(sys.argv)>2:
	files = sys.argv[1:]
	for i in files:
		df = t.read_pdf(i, pages="all")
		curso = 1
		firstTime = True
		grado = i.split("/")[-1][:-4] # remove .pdf
		for j in df.itertuples():
			if type(j[1]) is not float:
				# print(j[1])
				if j[1]=="Asignatura" and curso<4 and not firstTime:
					curso+=1
				else:
					firstTime = False
					asignatura = multireplace(j[1].split("/")[0].encode("utf-8"), replacements)
					directory = basedir + "/" + grado + "/" + str(curso) + "/" + asignatura
					directory = multireplace(directory.decode("utf-8").title(), r2)
					print(directory)
 					createDir(directory)
 					createEmptyFile(directory + "/.empty")
else:
	print("errrrrrr")
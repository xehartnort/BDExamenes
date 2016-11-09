#!/usr/bin/python
from PIL import Image
import sys
import subprocess
import os
import pyocr
import pyocr.builders

from PyPDF2 import PdfFileReader

def pdf2tif(name):
    subprocess.call(['gm', 'convert', '-define', 'quantum:polarity=min-is-white',
                 '-endian','MSB', '-units','PixelsPerInch', '-density','408x392',
                 '-compress', 'Fax', '-sample','1728', '-bordercolor','White',
                 '-border','10x10', name, name+'.tif'])

fil = "examen-1.pdf"
# open pdf in order to know how many pages it has
with open(fil,'rb') as pdf:
    size = PdfFileReader(pdf).getNumPages()
#extract all pdf pages and crop the first quarter of each page
for i in range(0, size):
    img = fil+"["+str(i)+"]"
    pdf2tif(img)
    output = img+'.tif'
    with Image.open(output) as im:
        w, h = im.size
        im.crop((0, 0, w, h/4)).save(output) #  left, upper, right, and lower

tools = pyocr.get_available_tools()
if len(tools) == 0:
     print("No OCR tool found")
     sys.exit(1)
 # The tools are returned in the recommended order of usage
tool = tools[0]

for i in range(0, size):
    f_name = fil+"["+str(i)+"]"+".tif"
    txt = tool.image_to_string( Image.open(f_name), lang="spa" )
    #os.remove(f_name) #clean the mess
    print(txt)

#!/usr/bin/python3 -OO
# -*- coding: utf-8 -*-

import subprocess
import os
import hashlib

def hash_file(path, block_size=4096):
    hash_string = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(block_size*4), b''):
            hash_string.update(chunk)
    return hash_string.hexdigest()

for (dirpath, dirnames, files) in os.walk("../exámenes"):
    for filename in files:
        fpath = None
        if filename[-4:] in [".pdf", ".PDF"]:
        	fpath = dirpath+"/"+filename+'[0]'
        elif filename[-4:] in [".png", ".PNG", ".jpg", ".JPG", "JPEG", "jpeg"]:
        	fpath = dirpath+"/"+filename
        if( fpath != None):
        	md5 = hash_file(dirpath+"/"+filename)
        	subprocess.call(['gm', 'convert', '-crop', '100x50%', '-resize', '315x384','-quality','80', fpath, "../img/"+md5+".png"])
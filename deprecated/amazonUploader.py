#!/usr/bin/env python
# -*- coding: utf-8 -*-

from botocore.client import Config  # automagically create .torrent
from requests import get # download .torrent with GET request
from requests.utils import quote

'''
    url = download link
    file_name = where to save the downloaded content
'''
def download(url, file_name):
    # open in binary mode
    with open(file_name, "wb") as file:
        # get request
        response = get(url)
        # write to file
        file.write(response.content)
        
#Setup for amazon s3 server
session = boto3.Session()
s3_client = session.resource('s3', config=Config(signature_version='s3v4'))

#Upload to amazon s3 server
#    print("Uploading file:"+filename)
#    bucket="dgiim"
#    s3_client.Object(bucket, filename[2:]).put(Body=open(filename, 'rb'))
#Download .torrent file --- TO BE TESTED ---
#    URL = "http://3.eu-central-1.amazonaws.com/dgiim/"+filename[1:]+"?torrent"
#    URL.replace(" ","+")
#    URL = quote(URL, safe="/?") # % enconding
#    download(URL, "./torrents/"+md5sum+".torrent")

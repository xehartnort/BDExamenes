CSSMIN=lessc
OPTCSS=--clean-css="--s1 --advanced"
DIRCSS=css
CSSFILES=new_style

JSMIN=uglifyjs
OPTJS=--screw-ie8 --mangle --compress -o
DIRJS=js
JSFILES=add autocomplete

COMPRESSOR=gzip
OPTCOMP=--keep --best --force

HTMLFILES=add about search

all: html js css db

js: 
	for i in $(JSFILES); do \
		$(JSMIN) $(DIRJS)/$$i.js $(OPTJS) $(DIRJS)/$$i.min.js; \
		$(COMPRESSOR) $(OPTCOMP) $(DIRJS)/$$i.min.js; \
	done

css:
	for i in $(CSSFILES); do \
		$(CSSMIN) $(DIRCSS)/$$i.less $(OPTCSS) $(DIRCSS)/$$i.min.css; \
		$(COMPRESSOR) $(OPTCOMP) $(DIRCSS)/$$i.min.css; \
	done

html:
	for i in $(HTMLFILES); do \
		$(COMPRESSOR) $(OPTCOMP) $$i.html; \
	done

db: 
	dbtools/buildDB.sh

# PHONY rule
.PHONY: all js css db

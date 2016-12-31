CSS=lessc
OPTCSS=--clean-css="--s1 --advanced"
DIRCSS=css
FILESCSS=style

JS=uglifyjs
OPTJS=--screw-ie8 --mangle --compress -o
DIRJS=js
FILESJS=drop autocomplete

all: js css

js: $(FILESJS)

css: $(FILESCSS)

autocomplete :
	$(JS) $(DIRJS)/$@.js $(OPTJS) $(DIRJS)/$@.min.js

drop :
	$(JS) $(DIRJS)/$@.js $(OPTJS) $(DIRJS)/$@.min.js

style :
	$(CSS) $(DIRCSS)/$@.less $(OPTCSS) $(DIRCSS)/$@.min.css

# PHONY rule
.PHONY: all js css $(FILESJS) $(FILESCSS)

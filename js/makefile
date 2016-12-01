JS=uglifyjs
OPTJS=--screw-ie8 --mangle --compress -o
DIRJS=js/
FILESJS=drop autocomplete

all: $(FILESJS)

autocomplete :
	$(JS) $@.js $(OPTJS) $@.min.js

drop :
	$(JS) $@.js $(OPTJS) $@.min.js
# PHONY rule
.PHONY: all css

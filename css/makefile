CC=lessc
OPT=--clean-css="--s1 --advanced"
FILENAME=style

all : $(FILENAME).less
	$(CC) $< $(OPT) $(FILENAME).min.css

# PHONY rule
.PHONY: all

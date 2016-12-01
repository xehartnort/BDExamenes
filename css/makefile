CCS=lessc
OPTCSS=--clean-css="--s1 --advanced"
DIRCSS=css/
FILESCSS=style

all: css

css : $(FILESCSS).less
	$(CCS) $< $(OPTCSS) $(FILESCSS).min.css

# PHONY rule
.PHONY: all css

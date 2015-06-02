VER = 1.1.0
EXCLUDE = --exclude Makefile --exclude .\*
TAROPTS = -h

all: FORCE
	cd .. && find ./inventorydays -name "*~" -exec rm {} \; && tar czf packages/inventorydays-$(VER).gz $(TAROPTS) $(EXCLUDE) inventorydays

FORCE:

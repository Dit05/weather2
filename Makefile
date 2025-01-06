
copy-swagger: src/openapi.yaml
	cp src/openapi.yaml build/

typescript:
	npx tsc

build: typescript copy-swagger

run: build
	cd build && node index.js

.PHONY: build copy-swagger

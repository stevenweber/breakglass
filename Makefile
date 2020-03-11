SHELL:=/usr/bin/env bash
PATH := $(PATH):node_modules/.bin

SRC := $(shell find src/*.ts)
OUT := $(patsubst src/%, lib/%.js, $(basename $(SRC)))

.PHONY: clean package lint test test-watch

all: test lib/main.js dist/index.js ## test, build, and pack
package: dist/index.js ## package

$(word 1, $(OUT)): $(SRC)
	tsc -p ./tsconfig.json

dist/index.js: lib/main.js
	ncc build

clean: ## clean dist/ & lib/
	rm -rf dist/*
	rm -rf lib/*

lint: ## run linter
	eslint --quiet src/**/*.ts

test: lint ## run unit tests
	jest

test-watch: ## start test watcher
	jest --watch --watchPathIgnorePatterns tmp

help: ## Runs the help!
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

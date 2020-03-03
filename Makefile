SHELL:=/usr/bin/env bash
PATH := $(PATH):node_modules/.bin

.PHONY: clean package lint test test-watch

all: lib/main.js test dist/index.js ## test, build, and pack
package: dist/index.js ## package

lib/main.js: src/main.ts
	tsc

dist/index.js: lib/main.js
	ncc build

clean: ## clean dist/ & lib/
	rm -rf dist/*
	rm -rf lib/*

lint: ## run linter
	eslint src/**/*.ts

test: ## run unit tests
	jest

test-watch: ## start test watcher
	jest --watch --watchPathIgnorePatterns tmp

help: ## Runs the help!
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

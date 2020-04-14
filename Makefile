SHELL:=/usr/bin/env bash
PATH := $(PATH):node_modules/.bin
SRC := $(shell find src/*.ts)

dist/index.js: ${SRC} ## build project
	ncc build src/index.ts

.PHONY: setup
setup: ## setup project for development
	yarn

.PHONY: clean
clean: ## remove built files
	rm -rf dist/*

.PHONY: lint
lint: ## check for formatting errors
	eslint --quiet src/**/*.ts

.PHONY: test
test: ## verify functionality
	jest

.PHONY: test-watch
test-watch: ## start test watcher
	jest --watch --watchPathIgnorePatterns tmp

help: ## Runs the help!
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

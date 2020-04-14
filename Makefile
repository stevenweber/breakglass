SHELL:=/usr/bin/env bash
PATH := $(PATH):node_modules/.bin

.PHONY: clean package lint test test-watch

all: verify clean dist/index.js ## test and package
package: dist/index.js ## package

setup:
	yarn

dist/index.js:
	npx ncc build src/index.ts

clean: ## clean dist/ & lib/
	rm -rf dist/*

.PHONY: verify
verify: lint test

.PHONY: lint
lint: ## run linter
	eslint --quiet src/**/*.ts

.PHONY: test
test: ## run tests
	jest

test-watch: ## start test watcher
	jest --watch --watchPathIgnorePatterns tmp

help: ## Runs the help!
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

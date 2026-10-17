.PHONY: install dev build test typecheck preview

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

test:
	npm test

typecheck:
	npm run typecheck

preview:
	npm run preview

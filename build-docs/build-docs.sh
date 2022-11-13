#!/bin/bash

# Prerequisite: sudo apt install pandoc

cd "$(dirname "$0")"

pandoc --from markdown+yaml_metadata_block \
    --include-in-header includes/include-in-header.html \
    --include-before-body includes/include-before-body.html \
    --include-after-body includes/include-after-body.html \
    --filter filters/replace-includes.js \
    --highlight-style kate \
    --output ../docs/index.html \
    ../docs/index.md

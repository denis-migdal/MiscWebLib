#!/usr/bin/bash

DIR=$(dirname "$0")

function generate() {
    pyftsubset "$DIR/sources/$1.woff2" \
            --output-file="$DIR/generated/$1.woff2" --flavor=woff2 \
            --unicodes="$2" 
}

# 🧩 U+1F9E9
generate "NotoColorEmoji" "U+1F9E9"
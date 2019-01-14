#!/usr/bin/env bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
(
    cd "$parent_path/lib"
    echo "generting ./doc/alert.md"
    npx jsdoc2md -f ./base/alert.js > ../doc/alert.md

    for filename in *.js; do
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi
    
        echo "generting ./doc/${filename%%.*}.md"
        npx jsdoc2md -f "./$filename" > "../doc/${filename%%.*}.md"
    done
    
    cd router
    for filename in *.js; do
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi

        echo "generting ./doc/${filename%%.*}.md"
        npx jsdoc2md -f "./$filename" > "../../doc/router/${filename%%.*}.md"
    done
)
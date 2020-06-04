#!/usr/bin/env bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
(
    cd "$parent_path/lib"
    echo "generating ./doc/alert.md"
    npx jsdoc2md -f ./base/alert.js > ../doc/alert.md
 
    echo "generating ./doc/googlesafetynet.md"
    npx jsdoc2md -f ./security/googlesafetynet/index.js > ../doc/security/googlesafetynet.md
    
    echo "generating ./doc/rootdetection.md"
    npx jsdoc2md -f ./security/rootdetection/index.js > ../doc/security/rootdetection.md

    echo "generating ./doc/googleplayservices.md"
    npx jsdoc2md -f ./security/googleplayservices/index.js > ../doc/security/googleplayservices.md
 
    for filename in *; do
        barename="${filename/".js"/}"
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi

        if [ -f "$filename/index.js" ]; then
            echo "generating ./doc/${filename%%.*}.md"
            npx jsdoc2md -f "./$filename/index.js" > "../doc/${filename%%.*}.md"
        fi
    done
    
    cd router
    for filename in *; do
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi
    
        if [ -f "$filename/index.js" ]; then
            echo "generating ./doc/${filename%%.*}.md"
            npx jsdoc2md -f "./$filename/index.js" > "../../doc/router/${filename%%.*}.md"
        fi
    done
        
    cd ../components
    for filename in *; do
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi

        if [ -f "$filename/index.js" ]; then
            echo "generating ./doc/${filename%%.*}.md"
            npx jsdoc2md -f "./$filename/index.js" > "../../doc/components/${filename%%.*}.md"
        fi
    done

    cd ../art
    for filename in *; do
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi

        if [ -f "$filename/index.js" ]; then
            echo "generating ./doc/${filename%%.*}.md"
            npx jsdoc2md -f "./$filename/index.js" > "../../doc/art/${filename%%.*}.md"
        fi
    done
)
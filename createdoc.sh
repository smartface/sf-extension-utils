#!/usr/bin/env bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
(
    cd "$parent_path/lib"
    echo "generating ./doc/alert.md"
    npx jsdoc2md -f ./base/alert.js > ../doc/alert.md
 
    echo "generating ./doc/googlesafetynet.md"
    npx jsdoc2md -f ./security/googlesafetynet.js > ../doc/security/googlesafetynet.md
    
    echo "generating ./doc/rootdetection.md"
    npx jsdoc2md -f ./security/rootdetection.js > ../doc/security/rootdetection.md

    echo "generating ./doc/googleplayservices.md"
    npx jsdoc2md -f ./security/googleplayservices.js > ../doc/security/googleplayservices.md
 
    for filename in *.js; do
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi
    
        echo "generating ./doc/${filename%%.*}.md"
        npx jsdoc2md -f "./$filename" > "../doc/${filename%%.*}.md"
    done
    
    cd router
    for filename in *.js; do
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi

        echo "generating ./doc/${filename%%.*}.md"
        npx jsdoc2md -f "./$filename" > "../../doc/router/${filename%%.*}.md"
    done
        
    cd ../components
    for filename in *.js; do
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi

        echo "generating ./doc/${filename%%.*}.md"
        npx jsdoc2md -f "./$filename" > "../../doc/components/${filename%%.*}.md"
    done

    cd ../art
    for filename in *.js; do
        if [[ "$filename" == "index.js" ]]; then
            continue
        fi

        echo "generating ./doc/${filename%%.*}.md"
        npx jsdoc2md -f "./$filename" > "../../doc/art/${filename%%.*}.md"
    done
)
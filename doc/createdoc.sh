#!/usr/bin/env bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

(
    cd "$parent_path"
    jsdoc2md -f ../lib/base/alert.js > alert.md
    jsdoc2md -f ../lib//permission.js > permission.md
    jsdoc2md -f ../lib//rau.js > rau.md
    jsdoc2md -f ../lib//speechtotext.js > speech_to_text.md
    jsdoc2md -f ../lib//location.js > location.md
    jsdoc2md -f ../lib//fingerprint.js > fingerprint.md
    jsdoc2md -f ../lib//orientation.js > orientation.md
    jsdoc2md -f ../lib//service-call.js > service-call.md
)
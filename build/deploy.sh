#!/bin/bash
set -e # stop on error

echo build client ...
npm run build

echo push..
gh-pages -d dist

echo All done!

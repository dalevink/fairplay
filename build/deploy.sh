#!/bin/bash
set -e # stop on error

echo build client ...
npm run build

echo check out branch gh-pages ...
git subtree push --prefix dist origin gh-pages

echo All done!
#!/bin/bash

echo "Fetching from git"
git reset --hard HEAD
git fetch https://github.com/xyzcoder/xyzcoder.github.io.git
git pull https://github.com/xyzcoder/xyzcoder.github.io.git

cd /pavan/xyzcoder.github.io
bundle install

bundle exec jekyll serve --livereload --host 0.0.0.0
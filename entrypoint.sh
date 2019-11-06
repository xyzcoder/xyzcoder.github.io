#!/bin/bash

echo "Fetching from git"
git reset --hard HEAD
git fetch https://github.com/xyzcoder/xyzcoder.github.io.git
git pull https://github.com/xyzcoder/xyzcoder.github.io.git

cd /pavan/xyzcoder.github.io

chmod u+x /pavan/xyzcoder.github.io/entrypoint.sh

bundle install

chmod u+x /pavan/xyzcoder.github.io/gitpush.sh

rerun /pavan/xyzcoder.github.io/gitpush.sh -b

bundle exec jekyll serve --livereload --host 0.0.0.0


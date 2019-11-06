#!/bin/bash

echo "Fetching from git using username $GIT_Username"

git config --global user.email "xyzcoder1989@gmail.com"
git config --global user.name "xyzcoder"
git config --global user.password $GIT_Password

echo "================================"
git config --global user.password

git reset --hard HEAD
git fetch https://github.com/xyzcoder/xyzcoder.github.io.git
git pull https://github.com/xyzcoder/xyzcoder.github.io.git

cd /pavan/xyzcoder.github.io

chmod u+x /pavan/xyzcoder.github.io/entrypoint.sh

bundle install

chmod u+x /pavan/xyzcoder.github.io/gitpush.sh

rerun -b -i gitpush.sh -i entrypoint.sh /pavan/xyzcoder.github.io/gitpush.sh & bundle exec jekyll serve --livereload --host 0.0.0.0


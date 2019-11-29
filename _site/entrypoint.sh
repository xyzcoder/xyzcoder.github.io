#!/bin/bash

cd /pavan/xyzcoder.github.io

ls

chmod u+x /pavan/xyzcoder.github.io/entrypoint.sh

bundle install

bundle exec jekyll serve --livereload --host 0.0.0.0


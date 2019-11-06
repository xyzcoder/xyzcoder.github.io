#!/bin/bash

echo "Fetching from git"
git reset --hard HEAD
git fetch https://github.com/xyzcoder/xyzcoder.github.io.git
git pull https://github.com/xyzcoder/xyzcoder.github.io.git
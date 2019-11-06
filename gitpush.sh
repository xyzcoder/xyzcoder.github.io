#!/usr/bin/env bash
git add -A
git commit -m "Automatic update of modified files" && git push

git pull https://github.com/xyzcoder/xyzcoder.github.io.git

chmod u+x /pavan/xyzcoder.github.io/entrypoint.sh
chmod u+x /pavan/xyzcoder.github.io/gitpush.sh
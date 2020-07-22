#!/bin/bash

target=$1
echo $target
del_files=($target/merge_rules.sh $target/merge.sh $target/merge_classes.sh $target/temp)
for file in "${del_files[@]}"; do         # iterate over the rest
  if [ ! -f "$file" ]; then
    echo "File not found"
  else
    rm "$file"
  fi
done

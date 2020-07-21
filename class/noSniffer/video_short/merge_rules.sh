#!/bin/bash

# https://stackoverflow.com/questions/23387256/shell-script-to-join-5-or-more-json-files-together
shopt -s nullglob
declare -a jsons
jsons=(*.json) # ${jsons[@]} now contains the list of files to concatenate
echo '[' > temp
if [ ${#jsons[@]} -gt 0 ]; then # if the list is not empty
  cat "${jsons[0]}" >> temp # concatenate the first file to the temp...
  unset 'jsons[0]'                   # and remove it from the list
  for f in "${jsons[@]}"; do         # iterate over the rest
      echo "," >>temp
      cat "$f" >>temp
  done
fi
echo ']' >>temp             # complete the temp

echo success

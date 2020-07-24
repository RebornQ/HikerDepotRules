#!/bin/bash

source_dir=$1
home=$2

if [ ! -n "$source_dir" ]; then
  echo "source_dir is null"
else
  cd $source_dir
fi
# https://stackoverflow.com/questions/23387256/shell-script-to-join-5-or-more-json-files-together
shopt -s nullglob
declare -a jsons
jsons=(*.json) # ${jsons[@]} now contains the list of files to concatenate
echo '[' > temp
skipNotice=false
if [ ${#jsons[@]} -gt 0 ]; then # if the list is not empty
  if [[ ${jsons[0]} = notice*.json  ]]; then
    echo ${jsons[0]}" 已被跳过"
    skipNotice=true
  else
    cat "${jsons[0]}" >> temp # concatenate the first file to the temp...
  fi
  unset 'jsons[0]'                   # and remove it from the list
  for f in "${jsons[@]}"; do         # iterate over the rest
      if [[ $f == notice*.json  ]]; then
        echo $f" 已被跳过"
        continue
      fi
      # echo $f" 未被跳过"
      if [ $skipNotice == false ]; then
          echo "," >>temp
      else
        skipNotice=false
      fi
      cat "$f" >>temp
  done
fi
echo ']' >>temp             # complete the temp

echo success
if [ ! -n "$home" ]; then
  echo "home is null"
else
  cd $home
fi

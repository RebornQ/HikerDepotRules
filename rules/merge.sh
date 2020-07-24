#!/bin/bash

source_dir=$1
home=$2

if [ ! -n "$source_dir" ]; then
  echo "source_dir is null"
else
  cd $source_dir
fi
dataContent=`cat temp`

# https://stackoverflow.com/questions/23387256/shell-script-to-join-5-or-more-json-files-together
echo '{' > manifest.json
noticeJson=`cat notice*`
noticeContent=
if [ ! -n "$noticeJson" ]; then
  echo "Notice IS NULL"
else
  echo "Notice NOT NULL"
  echo $noticeJson | jq '.notice' > temp
  noticeContent=`cat temp`
fi
if [ ! -n "$noticeContent" ]; then
    echo "NoticeContent IS NULL"
else
  echo "NoticeContent NOT NULL"
  echo '"notice": ' >> manifest.json
  echo $noticeContent >> manifest.json
  echo ','>> manifest.json
fi

if [ ! -n "$dataContent" ]; then
  echo "DataContent IS NULL"
else
  echo "DataContent NOT NULL"
  echo '"data": '>> manifest.json
  echo $dataContent >> manifest.json
fi
echo '}' >> manifest.json

formatJSON=`cat manifest.json | jq .`
if [ ! -n "$formatJSON" ]; then
  echo "formatJSON is null"
else
  echo $formatJSON | jq . > manifest.json
fi

if [ ! -n "$home" ]; then
  echo "home is null"
else
  cd $home
fi

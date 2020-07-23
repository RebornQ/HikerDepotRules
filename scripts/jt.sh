#!/bin/bash

# 这是一个简单的JSON工具，你可以使用他来对json文件进行一些操作。如：
# 1.切割json数组成文件：
# bash ./jt.sh -t split -f manifest.json -s .data

# https://blog.csdn.net/SunnyYoona/article/details/54668016
# https://www.jianshu.com/p/6393259f0a13

Usage() { #定义函数Usage，输出脚本使用方法
  echo "Usage: "
  echo "jt [-h] [-t <tool name>] [-f <filename>] [-s <json selector>] [-o <output directory>]"
  exit 0
}

while getopts 'ht:f:o:s:' opt; do
  case ${opt} in
    h)
     Usage
      exit
      ;;
    t)
      tool="${OPTARG}"
      ;;
    f)
      file="${OPTARG}"
      if [ ! -f $file ]; then #判断选项所跟的参数是否存在且是文件
       echo "$file: No such file"
       exit
      fi
     ;;
    o)
      output_dir="${OPTARG}"
      if [ ! -d $output_dir ]; then #判断选项所跟的参数是否存在且是文件夹
        echo "$output_dir: No such directory, making..."
        mkdir $output_dir
        echo "mkdir success."
      fi
      ;;
    s)
      selector="${OPTARG}"
      ;;
    ?)
      Usage
      exit 1
      ;;
    esac
done

if [[ ! -n $tool ]]; then
  echo "Requires json tool with an argument [-t <tool name>]"
  exit 1
fi
if [[ ! -n $file ]]; then
  echo "Requires json file with an argument [-f filename]"
  exit 1
fi
if [[ ! -n $output_dir ]]; then
  output_dir="output"
  if [ ! -d $output_dir ]; then #判断选项所跟的参数是否存在且是文件夹
    echo "$output_dir: No such directory, making..."
    mkdir $output_dir
    echo "mkdir success."
  fi
fi
echo "file=[$file] selector=[$selector] output_dir=[$output_dir]"

json=$(cat $file)
# split json obj from array to file
if [ $tool = "split" ]; then
    if [ ! -n "$selector" ]; then
      echo "Requires json selector with an argument [-s selector]"
      exit 1
    else
      if [ -d $output_dir ]; then #判断选项所跟的参数是否存在且是文件夹
        cd $output_dir
      fi
      for row in $(echo $json | jq "$selector" | jq -c ".[]"); do
        json_file_name=$(echo ${row} | jq -r ".title").json
        echo ${row} | jq "." > $json_file_name
      done
    fi
fi

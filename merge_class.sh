#!/bin/bash

# https://blog.csdn.net/robinblog/article/details/8853628
DIR=`ls $1`
home=$2
echo $DIR
echo $home
for dir in ${DIR};
do
  dir=$1${dir}"/"
	if [ -d ${dir} ];then
		echo $dir
		cp merge_rules.sh ${dir}
		cp merge.sh ${dir}
		cd ${dir}
		pwd
		bash merge_rules.sh
		bash merge.sh
		cd $home
	fi
done

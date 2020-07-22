#!/bin/bash

# 不能删
home=$(pwd)
scripts_dir=$home'/scripts'
bash $scripts_dir/cp_scripts.sh $scripts_dir $home
# 自定义
bash merge_rules.sh
bash merge.sh
bash merge_class.sh ./class/noSniffer/ $home
# 不能删
cd $home
bash $scripts_dir/clean_scripts.sh $home

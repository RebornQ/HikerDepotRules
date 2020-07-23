#!/bin/bash

# 不能删
home=$(pwd)
scripts_dir=$home'/scripts/'
rules_dir=$home'/rules/'
bash $scripts_dir/cp_scripts.sh $scripts_dir $home
#bash $scripts_dir/cp_scripts.sh $scripts_dir $rules_dir

# 自定义
bash merge_rules.sh $rules_dir $home
bash merge.sh $rules_dir $home
mv $rules_dir/manifest.json $home/manifest.json

bash merge_classes.sh ./classes/noSniffer/ $home

# 不能删
cd $home
bash $scripts_dir/clean_scripts.sh $home
bash $scripts_dir/clean_scripts.sh $rules_dir

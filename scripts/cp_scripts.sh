#!/bin/bash

from=$1
target=$2
echo $from
echo $target
cp $from/merge_rules.sh $target
cp $from/merge.sh $target
cp $from/merge_classes.sh $target

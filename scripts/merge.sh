#!/bin/bash

source_dir=$1
home=$2

if [ ! -n "$source_dir" ]; then
  echo "source_dir is null"
else
  cd $source_dir
fi
dataContent=`cat temp`

### 3 params: json, key, defaultValue
function getJsonValuesByAwk() {
    awk -v json="$1" -v key="$2" -v defaultValue="$3" 'BEGIN{
        foundKeyCount = 0
        while (length(json) > 0) {
            # pos = index(json, "\""key"\""); ## 这行更快一些，但是如果有value是字符串，且刚好与要查找的key相同，会被误认为是key而导致值获取错误
            pos = match(json, "\""key"\"[ \\t]*?:[ \\t]*");
            if (pos == 0) {if (foundKeyCount == 0) {print defaultValue;} exit 0;}

            ++foundKeyCount;
            start = 0; stop = 0; layer = 0;
            for (i = pos + length(key) + 1; i <= length(json); ++i) {
                lastChar = substr(json, i - 1, 1)
                currChar = substr(json, i, 1)

                if (start <= 0) {
                    if (lastChar == ":") {
                        start = currChar == " " ? i + 1: i;
                        if (currChar == "{" || currChar == "[") {
                            layer = 1;
                        }
                    }
                } else {
                    if (currChar == "{" || currChar == "[") {
                        ++layer;
                    }
                    if (currChar == "}" || currChar == "]") {
                        --layer;
                    }
                    if ((currChar == "," || currChar == "}" || currChar == "]") && layer <= 0) {
                        stop = currChar == "," ? i : i + 1 + layer;
                        break;
                    }
                }
            }

            if (start <= 0 || stop <= 0 || start > length(json) || stop > length(json) || start >= stop) {
                if (foundKeyCount == 0) {print defaultValue;} exit 0;
            } else {
                print substr(json, start, stop - start);
            }

            json = substr(json, stop + 1, length(json) - stop)
        }
    }'
}

# https://stackoverflow.com/questions/23387256/shell-script-to-join-5-or-more-json-files-together
echo '{' > manifest
noticeJson=`cat notice.txt`
noticeContent=
if [ ! -n "$noticeJson" ]; then
  echo "Notice IS NULL"
else
  echo "Notice NOT NULL"
  getJsonValuesByAwk "$noticeJson" "notice" "" > temp
  noticeContent=`cat temp`
fi
if [ ! -n "$noticeContent" ]; then
    echo "NoticeContent IS NULL"
else
  echo "NoticeContent NOT NULL"
  echo '"notice": '>> manifest
  echo $noticeContent >> manifest
  echo ','>> manifest
fi

if [ ! -n "$dataContent" ]; then
  echo "DataContent IS NULL"
else
  echo "DataContent NOT NULL"
  echo '"data": '>> manifest
  echo $dataContent >> manifest
fi
echo '}' >> manifest

if [ ! -n "$home" ]; then
  echo "home is null"
else
  cd $home
fi

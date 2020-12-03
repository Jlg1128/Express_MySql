#!/bin/bash
mysql -uroot -p --default-character-set=utf8 <<EOF
drop database if exists research;
create database research character set utf8;
use research;
source init.sql;
EOF
# cmd /k
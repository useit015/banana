#! /bin/bash

cd ~/Desktop/Modified\ Code/Contents/MacOS/
nohup ./Banana > foo.out 2> foo.err < /dev/null &
killall Terminal
killall iTerm
killall iTerm2

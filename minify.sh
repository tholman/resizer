#!/bin/bash
# DEPENDS ON MINIFY
# npm install minify [-g]

touch tmp # prepare temp output file

# minify files + output results to tmp
# then concat results to resizer.min.js
  minify js/resizer_canvas.js tmp
  echo `cat tmp` > resizer.min.js

  minify js/resizer.js tmp
  echo `cat tmp` >> resizer.min.js

  minify js/resizer_manager.js tmp
  echo `cat tmp` >> resizer.min.js

rm tmp # remove temp output file

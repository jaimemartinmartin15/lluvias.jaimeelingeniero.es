#!/bin/bash

# Path to file with hashes of screenshots of reference
hashestxt="e2e/hashes.txt"

# Read the file line by line
while read linea; do
  # pick path and hash
  expectedPath=$(echo "$linea" | cut -d' ' -f2 | cut -c2-)
  expectedHash=$(echo "$linea" | cut -d' ' -f1)
  
  # calculate the hash of the screenshot generated during e2e test
  calculatedHash=$(md5sum "$expectedPath" | cut -d' ' -f1)

  # compare the hashes
  if [ "$calculatedHash" != "$expectedHash" ]; then
    echo "Hash "$calculatedHash" for path "$expectedPath" does not match. Expected "$expectedHash
    exit 1
  fi
done < "$hashestxt"

exit 0
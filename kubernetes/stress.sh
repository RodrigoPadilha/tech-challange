#!/bin/bash
for i in {1..10000}; do
  curl localhost:31300/product
  sleep $1
done

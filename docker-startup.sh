#!/bin/bash

(
  cd /migrations &&
  npm run migrate:latest
)

(
  cd /app &&
  eval "$1"
)
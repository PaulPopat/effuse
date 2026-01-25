#!/bin/sh

npm run migrate:latest --prefix /migrations
eval "$APP_FILE"
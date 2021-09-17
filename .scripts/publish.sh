#!/bin/bash

## Release scoped package
cp ./package.json /tmp/package.json
jq '.name |= "@3846masa/axios-cookiejar-support"' /tmp/package.json > package.json
npm publish --access public --userconfig $NPM_CONFIG_USERCONFIG

## Release package
mv /tmp/package.json ./package.json
npm publish --access public --userconfig $NPM_CONFIG_USERCONFIG

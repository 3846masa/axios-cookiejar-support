#!/bin/bash
set -eux

## Clear npm_config_* env
unset "${!npm_config_@}"
unset "${!NPM_CONFIG_@}"

## Release scoped package
cp ./package.json /tmp/package.json
jq '.name |= "@3846masa/axios-cookiejar-support"' /tmp/package.json > package.json
npm publish --access public --userconfig /tmp/.npmrc

## Release package
mv /tmp/package.json ./package.json
npm publish --access public --userconfig /tmp/.npmrc

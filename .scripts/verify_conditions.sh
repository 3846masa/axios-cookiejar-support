#!/bin/bash
set -eux

## Clear npm_config_* env
unset "${!npm_config_@}"
unset "${!NPM_CONFIG_@}"

## Create npmrc
echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > /tmp/.npmrc
npm whoami --userconfig /tmp/.npmrc 1>&2

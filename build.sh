#!/bin/bash

DOCKER_REPO_NS="$1"
DOCKER_BUILD_TAG="$2"
if [ -z "$1" ]
then
    DOCKER_REPO_NS="zms"
fi
if [ -z "$2" ]
then
    DOCKER_BUILD_TAG="1.0"
fi

# build war
ant war

# copy and extract war at build/zimbraAdmin
mkdir -p build/zimbraAdmin
cp build/dist/jetty/webapps/zimbraAdmin.war build/zimbraAdmin/
cd build/zimbraAdmin
jar -xf zimbraAdmin.war && rm zimbraAdmin.war
cd ../../

# build admin consol docker image
docker build -t ${DOCKER_REPO_NS}/zms-admin-console:${DOCKER_BUILD_TAG} .

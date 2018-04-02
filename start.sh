#!/usr/bin/env bash

if [ ! -d data ]; then
  mkdir data
fi
if [ ! -d data/client ]; then
  mkdir data/client
fi
if [ ! -d data/client/releases ]; then
  mkdir data/client/releases
fi
if [ ! -d data/client/releases/prod ]; then
  mkdir data/client/releases/prod
fi
if [ ! -d data/client/releases/prod/apks ]; then
  mkdir data/client/releases/prod/apks
fi
if [ ! -d data/client/releases/prod/pwas ]; then
  mkdir data/client/releases/prod/pwas
fi
if [ ! -d data/client/releases/qa ]; then
  mkdir data/client/releases/qa
fi
if [ ! -d data/client/releases/qa/apks ]; then
  mkdir data/client/releases/qa/apks
fi
if [ ! -d data/client/releases/qa/pwas ]; then
  mkdir data/client/releases/qa/pwas
fi

# Load config.
source ./config.defaults.sh
if [ -f "./config.sh" ]; then
  source ./config.sh
else
  echo "You have no config.sh. Copy config.defaults.sh to config.sh, change the passwords and try again." && exit 1;
fi

# Allow to specify Tangerine Version as parameter in ./start.sh, other wise use the most recent tag.
if [ "$1" = "" ]; then
  if [ "T_TAG" = "" ]; then
    T_TAG=$(git describe --tags --abbrev=0)
    echo "Pulling $T_TAG"
    docker pull tangerine/tangerine:$T_TAG
  else
    T_TAG="$T_TAG"
  fi
else
  T_TAG="$1"
fi

# Pull tag.
echo "Pulling $T_TAG"
docker pull tangerine/tangerine:$T_TAG

echo "Stopping $T_CONTAINER_NAME"
docker stop $T_CONTAINER_NAME > /dev/null 
echo "Removing $T_CONTAINER_NAME"
docker rm $T_CONTAINER_NAME > /dev/null 

RUN_OPTIONS="
  --name $T_CONTAINER_NAME \
  --env \"NODE_ENV=production\" \
  --env \"T_VERSION=$T_TAG\" \
  --env \"T_PROTOCOL=$T_PROTOCOL\" \
  --env \"T_ADMIN=$T_ADMIN\" \
  --env \"T_PASS=$T_PASS\" \
  --env \"T_UPLOAD_USER=$T_UPLOAD_USER\" \
  --env \"T_UPLOAD_PASSWORD=$T_UPLOAD_PASSWORD\" \
  --env \"T_USER1=$T_USER1\" \
  --env \"T_USER1_PASSWORD=$T_USER1_PASSWORD\" \
  --env \"T_HOST_NAME=$T_HOST_NAME\" \
  --env "T_REPLICATE=$T_REPLICATE" \
  $T_PORT_MAPPING \
  --volume $(pwd)/data/client/releases:/tangerine/client/releases/ \
  --volume $(pwd)/data/db:/tangerine/db/ \
  --volume $(pwd)/data/client/content/groups:/tangerine/client/content/groups \
" 

CMD="docker run -d $RUN_OPTIONS tangerine/tangerine:$T_TAG"

echo "Running $T_CONTAINER_NAME at version $T_TAG"
eval ${CMD}

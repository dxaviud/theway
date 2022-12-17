#!/bin/bash

set -e

echo "Version: "
read -r VERSION

docker build -t dxaviud/theway:"$VERSION" .
docker push dxaviud/theway:"$VERSION"
ssh root@theway-droplet "docker login && docker pull dxaviud/theway:$VERSION && docker tag dxaviud/theway:$VERSION dokku/api:latest && dokku tags:deploy api latest"

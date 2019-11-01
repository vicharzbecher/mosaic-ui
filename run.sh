#!/bin/bash

docker rm -f api
docker run -d -p 80:8080 --name api mosaic-ui-api-demo 

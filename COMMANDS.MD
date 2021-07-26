## docker

- docker build -t user-service-image .
- docker run -it -p -v $(pwd):./usr/app/user-service:ro -v /usr/app/user-service/node_modules -p 8001:4000 --name user-service user-service-image # ro (read only bind mount, do docker can write to file system)
- docker run -it -p -v $(pwd):./usr/app/user-service:ro -v /usr/app/user-service/node_modules --env-file ./env -p 8001:4000 --name user-service user-service-image # ro (passing env var to docker container)
- docker ps
- docker image ls
- docker image rm image_name -fv (-f for force v for volume)

# remove dangling

- docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
- docker run -d --name node-app node-image
- docker logs container_name || container_id
- docker exec -it user-service bash
- docker volume ls
- docker volume prune
- docker logs container_name -f

# Remove all containers

docker rm $(docker ps -aq)

# docker-compose

- docker-compose up
- docker-compose up --build
- docker-compose down -v
- docker exec -it backend-user-service sh #get inside container and run commands as usual

# running diff compose based on env

- docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
- docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

- docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v-
- docker-compose -f docker-compose.yml -f docker-compose.dev.yml down node-app --no-deps # start as service without dependent service

## heroku

heroku stack:set container --app shopit-demo

# volumes

- volumes: #bind mounts
  - ".:/usr/src/app"
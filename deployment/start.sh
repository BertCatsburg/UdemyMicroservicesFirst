#! /bin/bash

# Comments
cp building/Dockerfile ../comments
cp building/.dockerignore ../comments
docker stop comments
docker rm comments
docker rmi comments

# Posts
cp building/Dockerfile ../posts
cp building/.dockerignore ../posts
docker stop posts
docker rm posts
docker rmi posts

# Moderation
cp building/Dockerfile ../moderation
cp building/.dockerignore ../moderation
docker stop moderation
docker rm moderation
docker rmi moderation

# Query
cp building/Dockerfile ../query
cp building/.dockerignore ../query
docker stop query
docker rm query
docker rmi query

# Event-Bus
cp building/Dockerfile ../event-bus
cp building/.dockerignore ../event-bus
docker stop events
docker rm events
docker rmi events


# Client
cp building/Dockerfile ../client
cp building/.dockerignore ../client
docker stop client
docker rm client
docker rmi client



docker-compose up

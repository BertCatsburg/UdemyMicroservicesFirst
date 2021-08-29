#!/bin/bash

kubectl apply -f comments-depl.yml
kubectl apply -f eventbus-depl.yml
kubectl apply -f moderation-depl.yml
kubectl apply -f posts-depl.yml
kubectl apply -f query-depl.yml

kubectl rollout restart deployment  comments-depl
kubectl rollout restart deployment  eventbus-depl
kubectl rollout restart deployment   moderation-depl
kubectl rollout restart deployment   posts-depl
kubectl rollout restart deployment   query-depl

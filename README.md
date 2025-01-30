# Nginx_SE140
Implementation for course COMP.SE.140 exercise: "NGINX hands on"

## Instructions to run
`git clone -b exercise4 git@github.com:EeroSan/Nginx_SE140.git`

`docker-compose up –-build`

Open a browser with [localhost:8198/](http://localhost:8198/)
>[!TIP]
>Login credentials: username `harjoitusharri` password `Harrinsalasana123`

`docker compose down` alternatively you can use STOP -button

## Task definition
Services 1 and 2 should run similarly as in the previous exercise, but

• Service 1 sleeps for 2 seconds after responding to the request. During that time the service cannot respond to next request.

• There are three instances of Service1

Nginx is added as a new service to the docker compose and listens in port 8198. 8198 is now the only port
that is exposed outside. Nginx acts as Web server and a browser will be used for testing instead of curl.
Load-balancing functionality is added to nginx to distribute requests to all three incarnations of service1.
The default round-robin algorithm is ok.

Basic authentication is added to nginx and one user with password is initialized.


## Required envionment variables

MONGO_USER=placeholderuser

MONGO_PASSWORD=placeholderpassword

MONGO_IP=mongo

MONGO_DB=mongodb

MONGO_PORT=27017

API_KEY=palaceholderapikey

MONGO_COLLECTION=placeholdercollection


## Curl commands to test

login

curl -u harjoitusharri:Harrinsalasana123 -v http://localhost:8198/

curl localhost:8197/state -X PUT -d ”PAUSED” -H ”Content-Type: text/plain” -H ”Accept: text/plain”

curl localhost:8197/state -X PUT -d ”PAUSED” -H ”Content-Type: text/plain” -H ”Accept: text/plain”

curl localhost:8197/state -X PUT -d "SHUTDOWN" -H "Content-Type: text/plain" -H "Accept: text/plain"

curl localhost:8197/state -X GET -H "Content-Type: text/plain" -H "Accept: text/plain"

curl localhost:8197/request -X GET -H "Content-Type: text/plain" -H "Accept: text/plain"

curl localhost:8197/run-log -X GET -H "Content-Type: text/plain" -H "Accept: text/plain"
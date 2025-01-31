# Nginx_SE140
Implementation for course COMP.SE.140 final project: "NGINX hands on"

## Instructions to run
`git clone -b project git@github.com:EeroSan/Nginx_SE140.git`

add a .env file with the variables from below to the cloned directory

`docker-compose up –-build`


Open a browser with [localhost:8198/](http://localhost:8198/)
>[!TIP]
>Login credentials: username `harjoitusharri` password `Harrinsalasana123`

`docker compose down` alternatively you can use STOP -button


## Required envionment variables

MONGO_USER=placeholderuser

MONGO_PASSWORD=placeholderpassword

MONGO_IP=mongo

MONGO_DB=mongodb

MONGO_PORT=27017

API_KEY=palaceholderapikey

MONGO_COLLECTION=placeholdercollection


## Curl commands to test

Notice that some of the “ are translated incorrectly on ubuntu when copied from here.
curl -u harjoitusharri:Harrinsalasana123 -v http://localhost:8198/

curl localhost:8197/state -X PUT -d ”PAUSED” -H ”Content-Type: text/plain” -H ”Accept: text/plain”

curl localhost:8197/state -X PUT -d ”INIT” -H ”Content-Type: text/plain” -H ”Accept: text/plain”

curl -u harjoitusharri:Harrinsalasana123 -v http://localhost:8198/

curl localhost:8197/request -X GET -H "Content-Type: text/plain" -H "Accept: text/plain

curl localhost:8197/run-log -X GET -H "Content-Type: text/plain" -H "Accept: text/plain"

curl localhost:8197/state -X PUT -d "SHUTDOWN" -H "Content-Type: text/plain" -H "Accept: text/plain"

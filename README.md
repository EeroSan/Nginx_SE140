# Nginx_SE140
Implementation for course COMP.SE.140 exercise: "NGINX hands on"

## Instructions to run
`git clone -b exercise4 git@github.com:EeroSan/Nginx_SE140.git`

`docker compose up –-build`

Open a browser with [localhost:8198/](http://localhost:8198/)

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

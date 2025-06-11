# DependencyMapper

A tool to store and analyze the dependencies between geospatial datasets, databases, services, applications and servers. 

Can be used to answer the following questions:
- Which applications are impacted if database XY has downtime during a migration? 
- Which applications are using geospatial service XY?
- ...

This project mainly provides a database model (see `/docs`) and a web-frontend to query this database.

## Development Container Setup 

Stack:
- NodeJS, ExpressJS
- Nodemon (Updates /server on file changes) 
- PostgreSQL (via `pg` JS library)

## Setup
Create a `.env` file in the root directory with the following variables:
```
SERVER_HOST=webserver
SERVER_PORT=3000

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=dev_db
POSTGRES_USER=user
POSTGRES_PASSWORD=CHANGE_ME
```

Run `docker compose up`, then the app will be available at http://localhost:3000/dashboard (port may be different 
depending on your .env config).


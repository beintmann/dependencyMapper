# WebDev Base Container Setup - NodeJS x PostgreSQL
A simple container setup for web development with NodeJS and PostgreSQL. This setup is intended to be used as a base for web development projects.

Tech Inside:
- NodeJS, ExpressJS
- Nodemon (Updates /server on file changes) 
- PostgreSQL (via pg JS library)

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



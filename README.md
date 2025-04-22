## WebDev Container Setup 
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

Run `docker compose up`, then the app will be available at http://localhost:3000/dashboard (port may be different 
depending on your .env config).


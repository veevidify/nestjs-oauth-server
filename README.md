## Contents
- [Contents](#contents)
- [Description](#description)
- [Installation](#installation)
- [Wrapper scripts](#wrapper-scripts)
- [OAuth2 server](#oauth2-server)

## Description
- This template uses [Nest](https://github.com/nestjs/nest) framework with TypeScript.
- Development environment uses `Docker` and `docker-compose`.
- Basic structure and dependency are set up, with `PostgreSQL` as the database engine and `TypeORM` as the connector library.
- Implement OAuth2 identity provider (server), using `oauthjs/node-oauth2-server`.

## Installation

- First create the necessary environment variables:
```sh
# terminal

$ cp .env.example .env
```
- Modify appropriate variable to match your environment:
```env
# .env

PATH_PREFIX=/home/devs/projects/nestjs-docker
WEB_PORT=3000
...
```
- Build the images for development:
```sh
# terminal

$ docker-compose build
```
- Create the volume for `Postgres`:
```sh
# terminal

$ docker volume create --name=svc_data
```
- Make helper script (`docker-compose` wrapper) executable:
```sh
# terminal

$ chmod ug+x npm
$ chmod ug+x db
$ chmod ug+x nest
```
- Persist `node_modules` for development:
```sh
# terminal

$ ./npm install
```
- Set up the database:
```sh
# terminal

$ ./npm run orm migration:run
```

- Up and running
```sh
#terminal

$ docker-compose up -d && docker-compose logs -f web
```

## Wrapper scripts
`npm` is wrapped inside a container to fixate `node` version.
- To run `npm` commands, simply call `./npm {args}`, e.g.
```sh
# terminal

$ ./npm install -D @types/lodash
```
- To run `package.json` commands, you need to use `--` to pass arguments to it, e.g.
```sh
# terminal

$ ./npm run orm migration:generate -- -n MyMigration
```
- Similar configuration for `nest` wrapper, e.g. `./nest {args}`

## OAuth2 server
WIP

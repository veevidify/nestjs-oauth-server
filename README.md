## Contents
- [Contents](#contents)
- [1. Description](#1-description)
- [2. Installation](#2-installation)
- [3. Wrapper scripts](#3-wrapper-scripts)
- [4. OAuth2 server](#4-oauth2-server)
  - [a. Overview](#a-overview)
  - [b. Setup](#b-setup)

---

## 1. Description
- This template uses [Nest](https://github.com/nestjs/nest) framework with TypeScript.
- Development environment uses `Docker` and `docker-compose`.
- Basic structure and dependency are set up, with `PostgreSQL` as the database engine and `TypeORM` as the connector library.
- Implement OAuth2 identity provider (server), using `oauthjs/node-oauth2-server`.

---

## 2. Installation

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

---

## 3. Wrapper scripts
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

---

## 4. OAuth2 server
### a. Overview
- OAuth2 server implementation make use of `oauthjs/node-oauth2-server` for request parsing / response generating flow.
- Class `auth/oauth/providers/oauth2.express/ExpressOAuth` serves as a `Nest` dependency and wrap around `oauthjs/node-oauth2-server` methods. This implementation is loosely based on `oauthjs/express-oauth-server`, file `src/index.js`
- Barebone methods for generating, persisting and retrieving tokens are implemented under `auth/oauth/oauth.model/OAuthModel` (also a `Nest` dependency).
- Authentications use `Passport` local strategy and bearer strategy. Basic implementation inside `auth/guards` and `auth/strategies`.

### b. Setup
- To get started, first you need to create a user and a client. Use `seeders/sample.sql` and `entities/` as a reference, using a sql browser of choice, run:
```SQL
insert into public.user (
    "firstName",
    "lastName",
    "username",
    "password",
    "roles"
  )
values (
    'admin',
    'user',
    'admin',
    '$2y$12$ZI5G/TpDlfPU35PNvlMN0ueyxBAl5InAGydYjmLvF0Qn2eRZqLkXm',
    '{user, admin}'
  )

insert into public.client (
    "name",
    "clientId",
    "clientSecret",
    "redirectUris",
    "isTrusted",
    "grants",
    "accessTokenLifetime",
    "refreshTokenLifetime"
  )
values (
    'Test Client',
    'testid',
    'testsecret',
    '{http://localhost:3000, http://localhost:3001/login?idp=custom}',
    TRUE,
    '{authorization_code, password, refresh_token}',
    3600,
    3600
  )
```
*Note*: the hash here is `"123456"`

- You will need to establish an authenticated session to be able to test the oauth2 flow.
- To demonstrate the basic authorization code flow, you can try using this repository: https://github.com/veevidify/react-material-starter.
- Refer to its `README.md` to get setup. Afterwards, navigate to `/login` and click on "Login using our IDP".

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
insert into public.user (
    "firstName",
    "lastName",
    "username",
    "password",
    "roles"
  )
values (
    'V',
    'N',
    'veevidify',
    '$2y$12$ZI5G/TpDlfPU35PNvlMN0ueyxBAl5InAGydYjmLvF0Qn2eRZqLkXm',
    '{user}'
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
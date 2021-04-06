insert into public.user ("firstName", "lastName", "username", "password", "roles")
values ('veevidify', 'n', 'veevidify', '$2y$12$ZI5G/TpDlfPU35PNvlMN0ueyxBAl5InAGydYjmLvF0Qn2eRZqLkXm', '{user, admin}')

insert into public.client ("name", "clientId", "clientSecret", "isTrusted")
values ('Test Client', 'testid', 'testsecret', TRUE)

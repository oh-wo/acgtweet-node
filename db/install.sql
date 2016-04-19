DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

CREATE TABLE oauth_tokens (
  id                       UUID                        NOT NULL,
  access_token             TEXT                        NOT NULL,
  access_token_expires_on  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  client_id                TEXT                        NOT NULL,
  refresh_token            TEXT                        NOT NULL,
  refresh_token_expires_on TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  user_id                  UUID                        NOT NULL
);

CREATE TABLE oauth_clients (
  client_id     TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  redirect_uri  TEXT NOT NULL
);
ALTER TABLE oauth_clients ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (client_id, client_secret);

CREATE TABLE users (
  id       UUID PRIMARY KEY,
  email    TEXT NOT NULL,
  password TEXT NOT NULL
);
CREATE INDEX users_username_password ON users USING BTREE (email, password);
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;


CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  email    TEXT NOT NULL,
  password TEXT NOT NULL
);
CREATE INDEX users_username_password ON users USING BTREE (email, password);


CREATE TABLE oauth_tokens (
  id                       SERIAL PRIMARY KEY,
  access_token             TEXT,
  access_token_expires_on  TIMESTAMP WITHOUT TIME ZONE,
  client_id                TEXT,
  refresh_token            TEXT,
  refresh_token_expires_on TIMESTAMP WITHOUT TIME ZONE,
  user_id                  INT
);
ALTER TABLE oauth_tokens ADD CONSTRAINT  oauth_tokens__users_id
  FOREIGN KEY (user_id) REFERENCES users (id);

CREATE TABLE oauth_clients (
  client_id     TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  redirect_uri  TEXT NOT NULL
);
ALTER TABLE oauth_clients
  ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (client_id, client_secret);


insert into users (email,password) values ('owen@biomatters.com','password');


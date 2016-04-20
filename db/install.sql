DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;


CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  password   TEXT NOT NULL,
  first_name TEXT,
  last_name  TEXT
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
ALTER TABLE oauth_tokens
  ADD CONSTRAINT oauth_tokens__users_fk
FOREIGN KEY (user_id) REFERENCES users (id);

CREATE TABLE oauth_clients (
  client_id     TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  redirect_uri  TEXT NOT NULL
);
ALTER TABLE oauth_clients
  ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (client_id, client_secret);

CREATE TABLE sequences (
  id        SERIAL PRIMARY KEY,
  content   TEXT NOT NULL,
  author_id INT  NOT NULL,
  isPublic  BOOL
);
ALTER TABLE sequences
  ADD CONSTRAINT sequence_author_fk
FOREIGN KEY (author_id) REFERENCES users (id);

CREATE TABLE shared_sequences (
  sequenceId INT,
  userId     INT
);
ALTER TABLE shared_sequences
  ADD CONSTRAINT shared_sequences_pk
PRIMARY KEY (sequenceId, userId);

-- Preload users.
INSERT INTO users (first_name, last_name, email, password) VALUES ('Owen', 'Bodley', 'owen@biomatters.com', 'password');
INSERT INTO users (first_name, last_name, email, password) VALUES ('Bob', 'Roberts', 'bob@biomatters.com', 'password');
-- Preload sequences
INSERT INTO sequences (content, author_id, isPublic) VALUES ('acgtagtgctagcatgat', 1, FALSE);
INSERT INTO sequences (content, author_id, isPublic) VALUES ('acgtaatgat', 1, FALSE);
INSERT INTO sequences (content, author_id, isPublic) VALUES ('acgtagtgctagcatgat', 1, FALSE);
INSERT INTO sequences (content, author_id, isPublic) VALUES ('acgtattttttttttaaa', 2, TRUE);
INSERT INTO sequences (content, author_id, isPublic) VALUES ('gggggggggggggggggg', 2, FALSE);
-- Preload shared sequences
INSERT INTO shared_sequences VALUES (3,1);
INSERT INTO shared_sequences VALUES (4,1);
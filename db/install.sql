DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Copied directly from the `node-connect-pg-simple` repository.
-- @see https://github.com/voxpelli/node-connect-pg-simple/blob/master/table.sql
CREATE TABLE sessions (
  -- Columns must be named thus for compatibility with connect-pg-simple.
  sid     TEXT         NOT NULL,
  expire  TIMESTAMP(6) NOT NULL,
  created TIMESTAMP(6) NOT NULL DEFAULT current_timestamp,
  sess    JSON         NOT NULL
)
WITH (OIDS = FALSE
);
ALTER TABLE sessions
  ADD CONSTRAINT session_pkey PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  email    TEXT NOT NULL,
  password TEXT NOT NULL
);
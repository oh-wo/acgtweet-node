
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
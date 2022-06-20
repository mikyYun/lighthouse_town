-- CREATE TABLE favorites
-- (
--   id SERIAL PRIMARY KEY NOT NULL,
--   added_by, added REFERENCES users(id) ON DELETE CASCADE NOT NULL,
--   following INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
-- );
INSERT INTO favorites (added_by, added)
  VALUES (1, 2);
INSERT INTO favorites (added_by, added)
  VALUES (1, 4);

INSERT INTO favorites (added_by, added)
  VALUES (2, 4);
INSERT INTO favorites (added_by, added)
  VALUES (2, 5);
INSERT INTO favorites (added_by, added)
  VALUES (3, 4);
INSERT INTO favorites (added_by, added)
  VALUES (3, 5);
INSERT INTO favorites (added_by, added)
  VALUES (4, 1);
INSERT INTO favorites (added_by, added)
  VALUES (4, 3);
-- CREATE TABLE favorites
-- (
--   id SERIAL PRIMARY KEY NOT NULL,
--   followed INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
--   following INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
-- );
INSERT INTO favorites (followed, following)
  VALUES (1, 2);
INSERT INTO favorites (followed, following)
  VALUES (1, 3);
INSERT INTO favorites (followed, following)
  VALUES (1, 4);

INSERT INTO favorites (followed, following)
  VALUES (2, 1);
INSERT INTO favorites (followed, following)
  VALUES (2, 4);
INSERT INTO favorites (followed, following)
  VALUES (2, 5);
INSERT INTO favorites (followed, following)
  VALUES (3, 1);
INSERT INTO favorites (followed, following)
  VALUES (3, 2);
INSERT INTO favorites (followed, following)
  VALUES (3, 4);
INSERT INTO favorites (followed, following)
  VALUES (3, 5);
INSERT INTO favorites (followed, following)
  VALUES (4, 1);
INSERT INTO favorites (followed, following)
  VALUES (4, 3);
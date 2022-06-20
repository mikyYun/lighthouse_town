-- users / favorites, languages

-- users {id, username, email, languages_id, avatar_id}
-- favorites {id, added_by, added}
-- languages {id, name}

SELECT * FROM users
  JOIN favorites
  ON favorites.added_by=
  (
    SELECT * FROM languages
    WHERE users
    JOIN users.languages_id=languages.id
  )

SELECT
  users.id,
  users.name,
  languages.name
  FROM users
  JOIN favorites
  ON users.id=favorites.added_by
  JOIN languages
  ON 

SELECT  users.id, users.username, languages.id, languages.language_name
FROM users
JOIN user_language
ON users.id=user_language.user_id
JOIN languages
ON user_language.language_id=languages.id;


  JOIN favorites
  ON users.id=favorites.added_by
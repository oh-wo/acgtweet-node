SELECT *
FROM users u
  LEFT JOIN shared_sequences ss
    ON ss.userid = u.id
WHERE ss.sequenceid = $1;
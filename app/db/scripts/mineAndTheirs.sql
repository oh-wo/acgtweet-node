SELECT se.id, se.content, se.author_id, se.ispublic, u.email, u.first_name,u.last_name
FROM sequences se
  LEFT JOIN shared_sequences sh
    ON sh.sequenceId = se.id
  LEFT JOIN users u
    ON u.id = se.author_id
WHERE (
  se.author_id = $1
  OR sh.userId = $1
)
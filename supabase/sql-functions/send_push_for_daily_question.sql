-- This function is used to send a push notification for the daily question to all users.
CREATE OR REPLACE FUNCTION send_push_for_daily_question(to_topics TEXT[], message TEXT)
RETURNS TABLE (user_id uuid, username TEXT, subscription jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO ai_conversation (user_id, data)
  SELECT 
    id as user_id,
    json_build_array(
      json_build_object(
        'role', 'assistant',
        'content', message
      )
    ) as data
  FROM "user"
  WHERE topics && to_topics;

  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.username as username,
    ps.subscription
  FROM "user" u
  INNER JOIN push_subscription ps ON ps.user_id = u.id
  WHERE u.topics && to_topics;
END;
$$;

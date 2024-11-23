create or replace function search_insights (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  quote text,
  user_id uuid,
  username text,
  avatar_url text,
  bio text,
  similarity float
)
language sql stable
as $$
  select
    i.id,
    i.quote,
    u.id as user_id,
    u.username,
    u.avatar_url,
    u.bio,
    1 - (i.embedding <=> query_embedding) as similarity
  from insight i
  join "user" u on u.id = i.user_id
  where 1 - (i.embedding <=> query_embedding) > match_threshold
  order by (i.embedding <=> query_embedding) asc
  limit match_count;
$$;

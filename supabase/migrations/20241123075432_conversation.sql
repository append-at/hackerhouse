-- change user_message.user_id from not null to nullable
ALTER TABLE user_message ALTER COLUMN user_id DROP NOT NULL;

-- add embedding column to insight
ALTER TABLE insight ADD COLUMN embedding vector(1536) NOT NULL;

CREATE TABLE IF NOT EXISTS consideration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
  consideration text NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE consideration ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Considerations are viewable by the user" ON consideration FOR SELECT to authenticated USING (user_id = auth.uid());
CREATE POLICY "Considerations are insertable by the user" ON consideration FOR INSERT to authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Considerations are updatable by the user" ON consideration FOR UPDATE to authenticated USING (user_id = auth.uid());
CREATE POLICY "Considerations are deletable by the user" ON consideration FOR DELETE to authenticated USING (user_id = auth.uid());

CREATE INDEX ON consideration (user_id);

CREATE POLICY "Insights are insertable by the user" ON insight FOR INSERT to authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Insights are updatable by the user" ON insight FOR UPDATE to authenticated USING (user_id = auth.uid());
CREATE POLICY "Insights are deletable by the user" ON insight FOR DELETE to authenticated USING (user_id = auth.uid());

CREATE POLICY "Intimacy are insertable by the user" ON ai_intimacy FOR INSERT to authenticated WITH CHECK (user_id = auth.uid());

ALTER TABLE ai_intimacy ALTER COLUMN delta TYPE NUMERIC;

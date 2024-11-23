-- Users
CREATE TABLE IF NOT EXISTS "user" (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    username text NOT NULL,
    avatar_url text,
    bio text,
    created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE "user" IS 'Profile data for each user.';
COMMENT ON COLUMN "user".id IS 'References the internal Supabase Auth user.';

ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON "user" FOR SELECT to authenticated USING (true);
CREATE POLICY "Users can create their own profile" ON "user" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON "user" FOR UPDATE WITH CHECK (auth.uid() = id);

-- Conversations
CREATE TABLE IF NOT EXISTS user_conversation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
    other_user_id uuid REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    last_message_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE user_conversation IS 'A conversation between two users.';

ALTER TABLE user_conversation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conversations are viewable by participants" ON user_conversation FOR SELECT to authenticated USING (user_id = auth.uid() OR other_user_id = auth.uid());

-- User Messages
CREATE TABLE IF NOT EXISTS user_message (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
    conversation_id uuid REFERENCES user_conversation(id) ON DELETE CASCADE NOT NULL,
    message text NOT NULL,
    at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE user_message IS 'Individual messages sent by each user.';

ALTER TABLE user_message ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages are insertable by conversation participants" ON user_message FOR INSERT WITH CHECK (
    conversation_id IN (
        SELECT id FROM user_conversation WHERE user_id = auth.uid() OR other_user_id = auth.uid()
    )
);
CREATE POLICY "Messages are viewable by participants" ON user_message FOR SELECT to authenticated USING (
    conversation_id IN (
        SELECT id FROM user_conversation WHERE user_id = auth.uid() OR other_user_id = auth.uid()
    )
);

CREATE INDEX ON user_message (conversation_id);

-- Use Supabase Realtime to implement chat functionality
ALTER publication supabase_realtime add table user_message;

-- AI Conversations
CREATE TABLE IF NOT EXISTS ai_conversation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
    data jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    last_message_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE ai_conversation IS 'A conversation with the AI.';

ALTER TABLE ai_conversation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI conversations are viewable by the user" ON ai_conversation FOR SELECT to authenticated USING (user_id = auth.uid());

-- AI Intimacy
CREATE TABLE IF NOT EXISTS ai_intimacy (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
    delta int NOT NULL,
    reason text NOT NULL,
    at timestamptz DEFAULT now() NOT NULL    
);
COMMENT ON TABLE ai_intimacy IS 'The change in intimacy score for a user.';

CREATE INDEX ON ai_intimacy (user_id);

ALTER TABLE ai_intimacy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI intimacies are viewable by the user" ON ai_intimacy FOR SELECT to authenticated USING (user_id = auth.uid());

-- Insights
CREATE TABLE IF NOT EXISTS insight (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
    quote text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE insight IS 'A quote from the AI that was interesting to the user.';

ALTER TABLE insight ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insights are viewable by the user" ON insight FOR SELECT to authenticated USING (user_id = auth.uid());

CREATE INDEX ON insight (user_id);

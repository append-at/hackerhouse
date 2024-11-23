-- Users can create their own AI conversations.
-- Otherwise, admins will create them. (e.g. daily question)
CREATE POLICY "AI conversations are creatable by users" ON ai_conversation FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can have topics they are interested in.
ALTER TABLE "user" ADD COLUMN topics text[] DEFAULT '{}';
COMMENT ON COLUMN "user".topics IS 'The topics a user is interested in.';

-- Create push subscription table
CREATE TABLE IF NOT EXISTS push_subscription (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
    subscription jsonb NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE push_subscription IS 'Stores web push subscriptions for each user';

-- Add RLS policies for push subscriptions
ALTER TABLE push_subscription ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own subscription" 
    ON push_subscription FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own subscription" 
    ON push_subscription FOR SELECT 
    USING (auth.uid() = user_id);

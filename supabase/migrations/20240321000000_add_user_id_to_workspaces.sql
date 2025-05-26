-- Add user_id and is_home columns if they don't exist
DO $$ 
BEGIN
    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'workspaces' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE workspaces 
        ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Add index for the new column
        CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces (user_id);
        
        -- Add RLS policy
        ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow full access to own workspaces"
            ON workspaces
            USING (user_id = auth.uid())
            WITH CHECK (user_id = auth.uid());
    END IF;

    -- Add is_home column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'workspaces' 
        AND column_name = 'is_home'
    ) THEN
        ALTER TABLE workspaces 
        ADD COLUMN is_home BOOLEAN NOT NULL DEFAULT FALSE;

        -- Add unique index for home workspace per user
        CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_home_workspace_per_user 
        ON workspaces(user_id) 
        WHERE is_home;

        -- Add trigger to prevent home field updates
        CREATE OR REPLACE FUNCTION prevent_home_field_update()
        RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.is_home IS DISTINCT FROM OLD.is_home THEN
                RAISE EXCEPTION 'Updating the home field of workspace is not allowed.';
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER prevent_update_of_home_field
        BEFORE UPDATE ON workspaces
        FOR EACH ROW
        EXECUTE PROCEDURE prevent_home_field_update();

        -- Add trigger to prevent home workspace deletion
        CREATE OR REPLACE FUNCTION prevent_home_workspace_deletion()
        RETURNS TRIGGER AS $$
        BEGIN
            IF OLD.is_home THEN
                RAISE EXCEPTION 'Home workspace deletion is not allowed.';
            END IF;
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER prevent_home_workspace_deletion
        BEFORE DELETE ON workspaces
        FOR EACH ROW
        EXECUTE PROCEDURE prevent_home_workspace_deletion();
    END IF;
END $$; 
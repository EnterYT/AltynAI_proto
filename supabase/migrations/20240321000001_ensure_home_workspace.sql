-- Drop all tables and functions
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Function to create a home workspace for a user if they don't have one
CREATE OR REPLACE FUNCTION ensure_home_workspace()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user already has a home workspace
    IF NOT EXISTS (
        SELECT 1 FROM workspaces 
        WHERE user_id = NEW.id 
        AND is_home = true
    ) THEN
        -- Create a home workspace for the new user
        INSERT INTO workspaces (
            user_id,
            name,
            description,
            is_home,
            default_context_length,
            default_model,
            default_prompt,
            default_temperature,
            embeddings_provider,
            include_profile_context,
            include_workspace_instructions,
            instructions
        ) VALUES (
            NEW.id,
            'Home',
            'My home workspace',
            true,
            4000,
            'gpt-4-turbo-preview',
            'You are a helpful AI assistant.',
            0.7,
            'openai',
            true,
            true,
            'This is your home workspace.'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create home workspace for new users
DROP TRIGGER IF EXISTS create_home_workspace ON auth.users;
CREATE TRIGGER create_home_workspace
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION ensure_home_workspace();

-- Create home workspaces for existing users who don't have one
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT id FROM auth.users
        WHERE NOT EXISTS (
            SELECT 1 FROM workspaces 
            WHERE user_id = auth.users.id 
            AND is_home = true
        )
    LOOP
        INSERT INTO workspaces (
            user_id,
            name,
            description,
            is_home,
            default_context_length,
            default_model,
            default_prompt,
            default_temperature,
            embeddings_provider,
            include_profile_context,
            include_workspace_instructions,
            instructions
        ) VALUES (
            user_record.id,
            'Home',
            'My home workspace',
            true,
            4000,
            'gpt-4-turbo-preview',
            'You are a helpful AI assistant.',
            0.7,
            'openai',
            true,
            true,
            'This is your home workspace.'
        );
    END LOOP;
END $$; 
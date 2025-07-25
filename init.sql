-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    layout_json JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (adjust based on your auth setup)
-- Users can only see their own portfolios
CREATE POLICY "Users can view own portfolios" ON portfolios
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own portfolios
CREATE POLICY "Users can insert own portfolios" ON portfolios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own portfolios
CREATE POLICY "Users can update own portfolios" ON portfolios
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own portfolios
CREATE POLICY "Users can delete own portfolios" ON portfolios
    FOR DELETE USING (auth.uid() = user_id);

-- Allow public read access to portfolios (for public viewing)
CREATE POLICY "Allow public read access" ON portfolios
    FOR SELECT USING (true);

-- Insert some sample data (optional)
INSERT INTO portfolios (user_id, title, layout_json) VALUES 
(uuid_generate_v4(), 'Sample Portfolio', '{
    "blocks": [
        {
            "id": "text-1",
            "type": "text",
            "content": {
                "text": "Welcome to my portfolio!",
                "fontSize": 32,
                "fontWeight": "bold",
                "color": "#1F2937",
                "textAlign": "center"
            },
            "position": { "x": 100, "y": 50 },
            "size": { "width": 600, "height": 80 }
        },
        {
            "id": "text-2",
            "type": "text",
            "content": {
                "text": "I am a passionate developer with experience in modern web technologies.",
                "fontSize": 18,
                "fontWeight": "normal",
                "color": "#4B5563",
                "textAlign": "center"
            },
            "position": { "x": 100, "y": 150 },
            "size": { "width": 600, "height": 60 }
        },
        {
            "id": "button-1",
            "type": "button",
            "content": {
                "text": "Contact Me",
                "href": "mailto:contact@example.com",
                "backgroundColor": "#3B82F6",
                "textColor": "#FFFFFF",
                "borderRadius": 8,
                "padding": { "x": 24, "y": 12 }
            },
            "position": { "x": 350, "y": 250 },
            "size": { "width": 120, "height": 50 }
        }
    ]
}') ON CONFLICT DO NOTHING; 
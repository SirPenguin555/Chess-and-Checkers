# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-08-08-chess-gameplay-ai/spec.md

> Created: 2025-08-08
> Version: 1.0.0

## Schema Changes

### New Tables

#### games table
```sql
CREATE TABLE games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    white_player_id UUID REFERENCES auth.users(id),
    black_player_id UUID REFERENCES auth.users(id),
    game_type VARCHAR(20) NOT NULL DEFAULT 'chess', -- 'chess' or 'checkers'
    game_mode VARCHAR(20) NOT NULL DEFAULT 'vs_ai', -- 'vs_ai', 'vs_human', 'analysis'
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    result VARCHAR(20), -- 'white_wins', 'black_wins', 'draw', 'abandoned'
    result_reason VARCHAR(50), -- 'checkmate', 'resignation', 'stalemate', 'timeout', etc.
    current_fen TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    move_count INTEGER NOT NULL DEFAULT 0,
    white_time_remaining INTEGER, -- Time in seconds (for timed games)
    black_time_remaining INTEGER,
    ai_difficulty VARCHAR(20), -- 'easy', 'medium', 'hard', 'expert' (for AI games)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### game_moves table
```sql
CREATE TABLE game_moves (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    move_number INTEGER NOT NULL, -- Full move number (increments after black moves)
    color VARCHAR(5) NOT NULL, -- 'white' or 'black'
    move_notation VARCHAR(20) NOT NULL, -- Algebraic notation (e.g., 'e4', 'Nf3', 'O-O')
    move_uci VARCHAR(10) NOT NULL, -- UCI format (e.g., 'e2e4', 'g1f3')
    fen_before TEXT NOT NULL, -- Board position before move
    fen_after TEXT NOT NULL, -- Board position after move
    time_taken INTEGER, -- Time taken for move in milliseconds
    evaluation INTEGER, -- Engine evaluation in centipawns (optional)
    is_ai_move BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### user_game_preferences table
```sql
CREATE TABLE user_game_preferences (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    preferred_ai_difficulty VARCHAR(20) DEFAULT 'medium',
    auto_save_games BOOLEAN DEFAULT true,
    show_legal_moves BOOLEAN DEFAULT true,
    animation_speed VARCHAR(10) DEFAULT 'normal', -- 'slow', 'normal', 'fast'
    board_theme VARCHAR(30) DEFAULT 'classic',
    piece_set VARCHAR(30) DEFAULT 'classic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Indexes and Constraints

```sql
-- Performance indexes for game queries
CREATE INDEX idx_games_player_status ON games(white_player_id, black_player_id, status);
CREATE INDEX idx_games_created_at ON games(created_at);
CREATE INDEX idx_games_status ON games(status);

-- Game moves indexes for move history queries
CREATE INDEX idx_game_moves_game_id ON game_moves(game_id, move_number);
CREATE INDEX idx_game_moves_created_at ON game_moves(created_at);

-- Composite index for efficient move sequence queries
CREATE UNIQUE INDEX idx_game_moves_unique ON game_moves(game_id, move_number, color);

-- Check constraints for data integrity
ALTER TABLE games ADD CONSTRAINT chk_games_valid_type 
    CHECK (game_type IN ('chess', 'checkers'));

ALTER TABLE games ADD CONSTRAINT chk_games_valid_mode 
    CHECK (game_mode IN ('vs_ai', 'vs_human', 'analysis'));

ALTER TABLE games ADD CONSTRAINT chk_games_valid_status 
    CHECK (status IN ('active', 'completed', 'abandoned'));

ALTER TABLE games ADD CONSTRAINT chk_games_valid_result 
    CHECK (result IS NULL OR result IN ('white_wins', 'black_wins', 'draw', 'abandoned'));

ALTER TABLE games ADD CONSTRAINT chk_games_valid_difficulty 
    CHECK (ai_difficulty IS NULL OR ai_difficulty IN ('easy', 'medium', 'hard', 'expert'));

ALTER TABLE game_moves ADD CONSTRAINT chk_moves_valid_color 
    CHECK (color IN ('white', 'black'));

ALTER TABLE game_moves ADD CONSTRAINT chk_moves_positive_number 
    CHECK (move_number > 0);
```

### Foreign Key Relationships

- `games.white_player_id` → `auth.users.id` (for human players, NULL for AI)
- `games.black_player_id` → `auth.users.id` (for human players, NULL for AI)  
- `game_moves.game_id` → `games.id` (CASCADE DELETE for data consistency)
- `user_game_preferences.user_id` → `auth.users.id`

## Migration Scripts

### Initial Migration (001_create_chess_tables.sql)
```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create games table
CREATE TABLE games (
    -- [Full schema as defined above]
);

-- Create game_moves table  
CREATE TABLE game_moves (
    -- [Full schema as defined above]
);

-- Create user_game_preferences table
CREATE TABLE user_game_preferences (
    -- [Full schema as defined above]
);

-- Create indexes
-- [All indexes as defined above]

-- Create constraints
-- [All constraints as defined above]
```

### Update Timestamp Trigger (002_create_updated_at_trigger.sql)
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to games table
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Apply trigger to user_game_preferences table
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON user_game_preferences
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
```

## Rationale

### FEN Storage Decision
Storing both `fen_before` and `fen_after` in game_moves allows for efficient game reconstruction at any point without replaying all moves. This supports features like position analysis and quick game resume.

### Separate Moves Table
Using a dedicated `game_moves` table instead of storing moves as JSON in games table provides:
- Better query performance for move history
- Easier move-based analysis and statistics
- Support for partial game loading
- Better indexing capabilities

### AI Difficulty Storage
Storing `ai_difficulty` in the games table rather than deriving from user preferences allows:
- Game-specific difficulty settings
- Historical tracking of difficulty used
- Support for mid-game difficulty changes (future feature)

### Performance Considerations
- Composite indexes support efficient queries for game reconstruction
- CASCADE DELETE ensures data integrity when games are deleted  
- Check constraints prevent invalid data states
- Separate preferences table reduces games table size for better performance

## Data Integrity Rules

1. **Move Sequence Integrity**: Moves must be sequential by move_number and alternate colors
2. **FEN Validation**: All FEN strings must be valid chess positions  
3. **Game State Consistency**: Game status must match the actual position state
4. **Player Assignment**: AI games have NULL for the AI player_id
5. **Time Constraints**: Time remaining cannot be negative for timed games
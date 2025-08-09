# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-08-08-chess-gameplay-ai/spec.md

> Created: 2025-08-08
> Version: 1.0.0

## API Endpoints

### POST /api/chess/games

**Purpose:** Create a new chess game
**Authentication:** Required

**Parameters:**
```typescript
{
  gameMode: 'vs_ai' | 'vs_human' | 'analysis'
  aiDifficulty?: 'easy' | 'medium' | 'hard' | 'expert' // Required for vs_ai
  timeControl?: {
    initial: number // seconds
    increment: number // seconds per move  
  }
  color?: 'white' | 'black' | 'random' // Player's color preference for AI games
}
```

**Response:**
```typescript
{
  success: true
  data: {
    gameId: string
    whitePlayerId: string | null
    blackPlayerId: string | null
    gameMode: string
    aiDifficulty?: string
    currentFen: string
    status: 'active'
    createdAt: string
  }
}
```

**Errors:**
- 401: Unauthorized (user not logged in)
- 400: Invalid game parameters
- 500: Database error

### GET /api/chess/games/[gameId]

**Purpose:** Retrieve game state and history
**Authentication:** Required (must be game participant)

**Parameters:** 
- gameId: string (URL parameter)
- includeMoves?: boolean (query parameter, default: true)

**Response:**
```typescript
{
  success: true
  data: {
    id: string
    whitePlayerId: string | null
    blackPlayerId: string | null
    gameType: 'chess'
    gameMode: string
    status: 'active' | 'completed' | 'abandoned'
    result?: string
    resultReason?: string
    currentFen: string
    moveCount: number
    aiDifficulty?: string
    moves?: Array<{
      id: string
      moveNumber: number
      color: 'white' | 'black'
      moveNotation: string
      moveUci: string
      fenAfter: string
      timeTaken?: number
      isAiMove: boolean
      createdAt: string
    }>
    createdAt: string
    updatedAt: string
  }
}
```

**Errors:**
- 401: Unauthorized
- 403: Not a game participant
- 404: Game not found

### POST /api/chess/games/[gameId]/moves

**Purpose:** Submit a move for validation and processing
**Authentication:** Required (must be game participant and their turn)

**Parameters:**
```typescript
{
  move: {
    from: string // e.g., 'e2'
    to: string // e.g., 'e4'
    promotion?: 'q' | 'r' | 'b' | 'n' // For pawn promotion
  }
  // OR
  moveUci: string // e.g., 'e2e4' or 'e7e8q'
  timeTaken?: number // milliseconds spent on move
}
```

**Response:**
```typescript
{
  success: true
  data: {
    move: {
      id: string
      moveNumber: number
      color: 'white' | 'black'
      moveNotation: string // 'e4', 'Nf3', 'O-O', etc.
      moveUci: string
      fenBefore: string
      fenAfter: string
      timeTaken: number
      isAiMove: false
      createdAt: string
    }
    gameState: {
      currentFen: string
      status: 'active' | 'completed'
      result?: string
      resultReason?: string
      isCheck: boolean
      isCheckmate: boolean
      isStalemate: boolean
      validMoves: string[] // UCI format moves for current position
    }
    aiMove?: { // Only included if it's an AI game and AI needs to respond
      id: string
      moveNumber: number
      color: 'white' | 'black'
      moveNotation: string
      moveUci: string
      fenAfter: string
      evaluation?: number // centipawns
      isAiMove: true
      createdAt: string
    }
  }
}
```

**Errors:**
- 401: Unauthorized
- 403: Not player's turn or not game participant
- 400: Invalid move format
- 422: Illegal move
- 404: Game not found
- 409: Game already completed

### POST /api/chess/ai/analyze

**Purpose:** Get Stockfish analysis for a position
**Authentication:** Required

**Parameters:**
```typescript
{
  fen: string
  depth?: number // 1-20, default: 15
  multiPv?: number // Number of variations to analyze, default: 1
}
```

**Response:**
```typescript
{
  success: true
  data: {
    bestMove: string // UCI format
    evaluation: number // centipawns from white's perspective
    depth: number
    variations: Array<{
      move: string // UCI format
      evaluation: number
      pv: string[] // Principal variation in UCI format
    }>
    analysisTime: number // milliseconds taken
  }
}
```

### GET /api/chess/games

**Purpose:** Get user's game history
**Authentication:** Required

**Parameters:**
- status?: 'active' | 'completed' | 'abandoned' (query)
- gameMode?: 'vs_ai' | 'vs_human' (query)  
- limit?: number (default: 20, max: 100)
- offset?: number (default: 0)

**Response:**
```typescript
{
  success: true
  data: {
    games: Array<{
      id: string
      gameMode: string
      status: string
      result?: string
      aiDifficulty?: string
      moveCount: number
      createdAt: string
      updatedAt: string
    }>
    total: number
    hasMore: boolean
  }
}
```

### PUT /api/chess/games/[gameId]/resign

**Purpose:** Resign from an active game
**Authentication:** Required (must be game participant)

**Response:**
```typescript
{
  success: true
  data: {
    gameId: string
    result: string // 'white_wins' or 'black_wins'
    resultReason: 'resignation'
    updatedAt: string
  }
}
```

### GET /api/chess/user/preferences

**Purpose:** Get user's chess game preferences
**Authentication:** Required

**Response:**
```typescript
{
  success: true
  data: {
    preferredAiDifficulty: 'easy' | 'medium' | 'hard' | 'expert'
    autoSaveGames: boolean
    showLegalMoves: boolean
    animationSpeed: 'slow' | 'normal' | 'fast'
    boardTheme: string
    pieceSet: string
  }
}
```

### PUT /api/chess/user/preferences

**Purpose:** Update user's chess game preferences
**Authentication:** Required

**Parameters:**
```typescript
{
  preferredAiDifficulty?: 'easy' | 'medium' | 'hard' | 'expert'
  autoSaveGames?: boolean
  showLegalMoves?: boolean
  animationSpeed?: 'slow' | 'normal' | 'fast'
  boardTheme?: string
  pieceSet?: string
}
```

## Controller Logic

### GameController

**createGame()**
- Validate input parameters
- Generate game ID and set initial position
- Assign player colors (random for AI games if not specified)
- Store in database with 'active' status
- Return game data

**getGame()**
- Verify user is game participant
- Fetch game data and move history
- Calculate current game state from moves
- Return complete game information

**makeMove()**
- Validate user is current player
- Validate move legality using chess.js
- Store move in database
- Update game state (check for game end conditions)
- If AI game, trigger AI move calculation
- Return move result and updated game state

### AIController

**calculateMove()**
- Receive game position in FEN format
- Configure Stockfish based on difficulty level
- Run engine analysis for specified depth/time
- Extract best move and evaluation
- Return move in UCI format with metadata

**analyzePosition()**
- Accept FEN and analysis parameters
- Run Stockfish analysis with requested depth
- Return evaluation, best moves, and principal variations

## Error Handling

### Standard Error Responses
```typescript
{
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### Common Error Codes
- `INVALID_MOVE`: Move violates chess rules
- `NOT_PLAYER_TURN`: Attempted move when not player's turn  
- `GAME_COMPLETED`: Attempted action on finished game
- `INVALID_GAME_STATE`: Database inconsistency detected
- `AI_ENGINE_ERROR`: Stockfish engine failure
- `TIMEOUT_ERROR`: AI calculation exceeded time limit

## Rate Limiting

- Move submission: 1 request per second per game
- AI analysis: 5 requests per minute per user
- Game creation: 10 requests per hour per user
- Game history: 30 requests per minute per user

## WebSocket Events (Future Enhancement)

While not implemented in Phase 1, the API is designed to support real-time features:

- `game:move` - Broadcast moves to game participants
- `game:status` - Game state changes (check, checkmate, etc.)
- `ai:thinking` - AI calculation progress updates
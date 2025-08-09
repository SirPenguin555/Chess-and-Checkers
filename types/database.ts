export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          game_type: "chess" | "checkers";
          status: "active" | "completed" | "abandoned";
          white_player_id: string | null;
          black_player_id: string | null;
          current_player: "white" | "black";
          board_state: string; // FEN for chess, JSON for checkers
          move_history: string[]; // Array of moves in algebraic notation
          result: "white_wins" | "black_wins" | "draw" | "ongoing" | null;
          time_control: string | null; // JSON: {type: "blitz", minutes: 5, increment: 3}
          ai_difficulty: "easy" | "medium" | "hard" | "expert" | null;
          settings: Record<string, any> | null; // Game-specific settings
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          game_type: "chess" | "checkers";
          status?: "active" | "completed" | "abandoned";
          white_player_id?: string | null;
          black_player_id?: string | null;
          current_player?: "white" | "black";
          board_state: string;
          move_history?: string[];
          result?: "white_wins" | "black_wins" | "draw" | "ongoing" | null;
          time_control?: string | null;
          ai_difficulty?: "easy" | "medium" | "hard" | "expert" | null;
          settings?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          game_type?: "chess" | "checkers";
          status?: "active" | "completed" | "abandoned";
          white_player_id?: string | null;
          black_player_id?: string | null;
          current_player?: "white" | "black";
          board_state?: string;
          move_history?: string[];
          result?: "white_wins" | "black_wins" | "draw" | "ongoing" | null;
          time_control?: string | null;
          ai_difficulty?: "easy" | "medium" | "hard" | "expert" | null;
          settings?: Record<string, any> | null;
        };
      };
      moves: {
        Row: {
          id: string;
          game_id: string;
          move_number: number;
          player: "white" | "black";
          move_notation: string; // Algebraic notation
          from_square: string | null; // e.g., "e2"
          to_square: string | null; // e.g., "e4"
          piece: string | null; // e.g., "pawn", "knight", "queen"
          captured_piece: string | null;
          is_check: boolean;
          is_checkmate: boolean;
          is_castling: boolean;
          is_en_passant: boolean;
          promotion_piece: string | null;
          board_state_after: string; // Board state after this move
          created_at: string;
          evaluation: number | null; // Engine evaluation (-100 to +100)
          best_move: boolean; // Was this the engine's recommended move
        };
        Insert: {
          id?: string;
          game_id: string;
          move_number: number;
          player: "white" | "black";
          move_notation: string;
          from_square?: string | null;
          to_square?: string | null;
          piece?: string | null;
          captured_piece?: string | null;
          is_check?: boolean;
          is_checkmate?: boolean;
          is_castling?: boolean;
          is_en_passant?: boolean;
          promotion_piece?: string | null;
          board_state_after: string;
          created_at?: string;
          evaluation?: number | null;
          best_move?: boolean;
        };
        Update: {
          id?: string;
          game_id?: string;
          move_number?: number;
          player?: "white" | "black";
          move_notation?: string;
          from_square?: string | null;
          to_square?: string | null;
          piece?: string | null;
          captured_piece?: string | null;
          is_check?: boolean;
          is_checkmate?: boolean;
          is_castling?: boolean;
          is_en_passant?: boolean;
          promotion_piece?: string | null;
          board_state_after?: string;
          created_at?: string;
          evaluation?: number | null;
          best_move?: boolean;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: string; // "classic", "wood", "marble", "neon", "minimal"
          piece_set: string; // "classic", "modern", "3d", "artistic"
          board_orientation: "white" | "black";
          sound_enabled: boolean;
          move_animation_speed: "slow" | "normal" | "fast";
          show_coordinates: boolean;
          show_move_hints: boolean;
          auto_save: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: string;
          piece_set?: string;
          board_orientation?: "white" | "black";
          sound_enabled?: boolean;
          move_animation_speed?: "slow" | "normal" | "fast";
          show_coordinates?: boolean;
          show_move_hints?: boolean;
          auto_save?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: string;
          piece_set?: string;
          board_orientation?: "white" | "black";
          sound_enabled?: boolean;
          move_animation_speed?: "slow" | "normal" | "fast";
          show_coordinates?: boolean;
          show_move_hints?: boolean;
          auto_save?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          chess_rating: number;
          checkers_rating: number;
          games_played: number;
          games_won: number;
          games_drawn: number;
          games_lost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          chess_rating?: number;
          checkers_rating?: number;
          games_played?: number;
          games_won?: number;
          games_drawn?: number;
          games_lost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          chess_rating?: number;
          checkers_rating?: number;
          games_played?: number;
          games_won?: number;
          games_drawn?: number;
          games_lost?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
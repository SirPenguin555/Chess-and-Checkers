export type ChessPiece = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type ChessColor = "white" | "black";
export type ChessSquare = string; // e.g., "e4", "a1"

export interface ChessPosition {
  piece: ChessPiece;
  color: ChessColor;
  square: ChessSquare;
}

export interface ChessMove {
  from: ChessSquare;
  to: ChessSquare;
  piece: ChessPiece;
  captured?: ChessPiece;
  promotion?: ChessPiece;
  castling?: "kingside" | "queenside";
  enPassant?: boolean;
  check?: boolean;
  checkmate?: boolean;
  san: string; // Standard Algebraic Notation
  fen: string; // Board state after move
}

export interface ChessGameState {
  board: (ChessPosition | null)[][]; // 8x8 array
  currentPlayer: ChessColor;
  moveHistory: ChessMove[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  canCastleKingside: { white: boolean; black: boolean };
  canCastleQueenside: { white: boolean; black: boolean };
  enPassantSquare: ChessSquare | null;
  halfmoveClock: number;
  fullmoveNumber: number;
  fen: string;
}

export interface AIMove {
  from: ChessSquare;
  to: ChessSquare;
  promotion?: ChessPiece;
  evaluation?: number;
  depth?: number;
  time?: number;
}

export type AIDifficulty = "easy" | "medium" | "hard" | "expert";

export interface AISettings {
  difficulty: AIDifficulty;
  thinkingTime: number; // in milliseconds
  depth: number;
  multiPV: number; // number of principal variations
}

export interface ChessTheme {
  id: string;
  name: string;
  lightSquare: string;
  darkSquare: string;
  highlightColor: string;
  selectedColor: string;
  validMoveColor: string;
  checkColor: string;
}

export interface PieceSet {
  id: string;
  name: string;
  pieces: Record<`${ChessColor}_${ChessPiece}`, string>;
}

export interface GameSettings {
  theme: ChessTheme;
  pieceSet: PieceSet;
  showCoordinates: boolean;
  showMoveHints: boolean;
  enableSounds: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  boardOrientation: ChessColor;
}
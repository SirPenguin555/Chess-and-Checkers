import { Chess, Square, Move, PieceSymbol } from "chess.js";
import type {
  ChessGameState,
  ChessMove,
  ChessColor,
  ChessPiece,
  ChessPosition,
} from "../../types/chess";

export interface MoveResult {
  success: boolean;
  move?: ChessMove;
  error?: string;
}

export interface UndoResult {
  success: boolean;
  error?: string;
}

export class ChessEngine {
  private chess: Chess;

  constructor(fen?: string) {
    try {
      this.chess = new Chess(fen);
    } catch (error) {
      throw new Error("Invalid FEN");
    }
  }

  /**
   * Get the current game state
   */
  getGameState(): ChessGameState {
    const history = this.chess.history({ verbose: true });
    const moveHistory: ChessMove[] = history.map(move =>
      this.convertMove(move)
    );

    return {
      board: this.getBoardRepresentation(),
      currentPlayer: this.chess.turn() === "w" ? "white" : "black",
      moveHistory,
      isCheck: this.chess.inCheck(),
      isCheckmate: this.chess.isCheckmate(),
      isStalemate: this.chess.isStalemate(),
      isDraw: this.chess.isDraw(),
      canCastleKingside: {
        white: this.chess.getCastlingRights("w").k,
        black: this.chess.getCastlingRights("b").k,
      },
      canCastleQueenside: {
        white: this.chess.getCastlingRights("w").q,
        black: this.chess.getCastlingRights("b").q,
      },
      enPassantSquare: this.getEnPassantSquare(),
      halfmoveClock: this.getHalfmoveClock(),
      fullmoveNumber: this.getFullmoveNumber(),
      fen: this.chess.fen(),
    };
  }

  /**
   * Check if a move is valid without executing it
   */
  isValidMove(from: string, to: string, promotion?: ChessPiece): boolean {
    try {
      const moves = this.chess.moves({
        square: from as Square,
        verbose: true,
      });

      return moves.some(move => {
        const isToSquareMatch = move.to === to;
        const isPromotionMatch =
          !promotion || move.promotion === this.convertPieceToSymbol(promotion);
        return isToSquareMatch && isPromotionMatch;
      });
    } catch {
      return false;
    }
  }

  /**
   * Make a move on the board
   */
  makeMove(from: string, to: string, promotion?: ChessPiece): MoveResult {
    try {
      const moveOptions: any = { from, to };
      if (promotion) {
        moveOptions.promotion = this.convertPieceToSymbol(promotion);
      }

      const move = this.chess.move(moveOptions);

      if (!move) {
        return {
          success: false,
          error: "Invalid move",
        };
      }

      return {
        success: true,
        move: this.convertMove(move),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Move failed",
      };
    }
  }

  /**
   * Undo the last move
   */
  undoMove(): UndoResult {
    const move = this.chess.undo();

    if (!move) {
      return {
        success: false,
        error: "No moves to undo",
      };
    }

    return {
      success: true,
    };
  }

  /**
   * Get legal moves for a specific square
   */
  getLegalMoves(square: string): string[] {
    try {
      const moves = this.chess.moves({
        square: square as Square,
        verbose: true,
      });
      return moves.map(move => move.to);
    } catch {
      return [];
    }
  }

  /**
   * Get all legal moves for the current position
   */
  getAllLegalMoves(): Array<{
    from: string;
    to: string;
    promotion?: ChessPiece;
  }> {
    try {
      const moves = this.chess.moves({ verbose: true });
      return moves.map(move => ({
        from: move.from,
        to: move.to,
        promotion: move.promotion
          ? this.convertSymbolToPiece(move.promotion)
          : undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get the current FEN string
   */
  getFen(): string {
    return this.chess.fen();
  }

  /**
   * Get the board as a 2D array
   */
  getBoard(): (ChessPosition | null)[][] {
    return this.getBoardRepresentation();
  }

  /**
   * Convert square notation to array coordinates
   */
  squareToCoords(square: string): [number, number] {
    const file = square.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
    const rank = 8 - parseInt(square[1]); // '8' = 0, '7' = 1, etc.
    return [rank, file];
  }

  /**
   * Convert array coordinates to square notation
   */
  coordsToSquare(row: number, col: number): string {
    const file = String.fromCharCode(97 + col); // 0 = 'a', 1 = 'b', etc.
    const rank = (8 - row).toString(); // 0 = '8', 1 = '7', etc.
    return file + rank;
  }

  /**
   * Reset the game to starting position
   */
  reset(): void {
    this.chess.reset();
  }

  /**
   * Load a position from FEN
   */
  loadFen(fen: string): boolean {
    try {
      this.chess.load(fen);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the current turn
   */
  getTurn(): ChessColor {
    return this.chess.turn() === "w" ? "white" : "black";
  }

  /**
   * Check if the game is over
   */
  isGameOver(): boolean {
    return this.chess.isGameOver();
  }

  /**
   * Get the result of the game
   */
  getGameResult(): string {
    if (this.chess.isCheckmate()) {
      return this.chess.turn() === "w" ? "0-1" : "1-0";
    }
    if (this.chess.isDraw() || this.chess.isStalemate()) {
      return "1/2-1/2";
    }
    return "*";
  }

  /**
   * Convert chess.js move to our ChessMove type
   */
  private convertMove(move: Move): ChessMove {
    return {
      from: move.from,
      to: move.to,
      piece: this.convertSymbolToPiece(move.piece),
      captured: move.captured
        ? this.convertSymbolToPiece(move.captured)
        : undefined,
      promotion: move.promotion
        ? this.convertSymbolToPiece(move.promotion)
        : undefined,
      castling: this.determineCastlingType(move),
      enPassant: move.flags.includes("e"),
      check: move.flags.includes("+"),
      checkmate: move.flags.includes("#"),
      san: move.san,
      fen: this.chess.fen(),
    };
  }

  /**
   * Convert chess.js piece symbol to our ChessPiece type
   */
  private convertSymbolToPiece(symbol: PieceSymbol): ChessPiece {
    const pieceMap: Record<PieceSymbol, ChessPiece> = {
      p: "pawn",
      n: "knight",
      b: "bishop",
      r: "rook",
      q: "queen",
      k: "king",
    };
    return pieceMap[symbol];
  }

  /**
   * Convert our ChessPiece type to chess.js piece symbol
   */
  private convertPieceToSymbol(piece: ChessPiece): PieceSymbol {
    const symbolMap: Record<ChessPiece, PieceSymbol> = {
      pawn: "p",
      knight: "n",
      bishop: "b",
      rook: "r",
      queen: "q",
      king: "k",
    };
    return symbolMap[piece];
  }

  /**
   * Determine castling type from move flags
   */
  private determineCastlingType(
    move: Move
  ): "kingside" | "queenside" | undefined {
    if (move.flags.includes("k")) return "kingside";
    if (move.flags.includes("q")) return "queenside";
    return undefined;
  }

  /**
   * Get board representation as 2D array
   */
  private getBoardRepresentation(): (ChessPosition | null)[][] {
    const board: (ChessPosition | null)[][] = [];

    for (let rank = 0; rank < 8; rank++) {
      const row: (ChessPosition | null)[] = [];
      for (let file = 0; file < 8; file++) {
        const square = this.coordsToSquare(rank, file);
        const piece = this.chess.get(square as Square);

        if (piece) {
          row.push({
            piece: this.convertSymbolToPiece(piece.type),
            color: piece.color === "w" ? "white" : "black",
            square: square,
          });
        } else {
          row.push(null);
        }
      }
      board.push(row);
    }

    return board;
  }

  /**
   * Extract en passant square from FEN string
   */
  private getEnPassantSquare(): string | null {
    const fen = this.chess.fen();
    const fenParts = fen.split(" ");
    const epSquare = fenParts[3];
    return epSquare === "-" ? null : epSquare;
  }

  /**
   * Extract halfmove clock from FEN string
   */
  private getHalfmoveClock(): number {
    const fen = this.chess.fen();
    const fenParts = fen.split(" ");
    return parseInt(fenParts[4], 10);
  }

  /**
   * Extract fullmove number from FEN string
   */
  private getFullmoveNumber(): number {
    const fen = this.chess.fen();
    const fenParts = fen.split(" ");
    return parseInt(fenParts[5], 10);
  }
}

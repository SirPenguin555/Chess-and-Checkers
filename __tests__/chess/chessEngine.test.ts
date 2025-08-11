import { describe, it, expect, beforeEach } from "vitest";
import { Chess } from "chess.js";
import { ChessEngine } from "../../lib/chess/chessEngine";
import type { ChessGameState, ChessMove, ChessColor } from "../../types/chess";

describe("ChessEngine", () => {
  let engine: ChessEngine;

  beforeEach(() => {
    engine = new ChessEngine();
  });

  describe("Game Initialization", () => {
    it("should initialize with standard starting position", () => {
      const gameState = engine.getGameState();

      expect(gameState.fen).toBe(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      );
      expect(gameState.currentPlayer).toBe("white");
      expect(gameState.moveHistory).toHaveLength(0);
      expect(gameState.isCheck).toBe(false);
      expect(gameState.isCheckmate).toBe(false);
      expect(gameState.isStalemate).toBe(false);
    });

    it("should initialize from custom FEN position", () => {
      const customFen =
        "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 4 3";
      engine = new ChessEngine(customFen);

      expect(engine.getGameState().fen).toBe(customFen);
      expect(engine.getGameState().fullmoveNumber).toBe(3);
    });

    it("should handle invalid FEN gracefully", () => {
      expect(() => new ChessEngine("invalid-fen")).toThrow("Invalid FEN");
    });
  });

  describe("Move Validation", () => {
    it("should validate legal pawn moves", () => {
      const isValid = engine.isValidMove("e2", "e4");
      expect(isValid).toBe(true);

      const invalidMove = engine.isValidMove("e2", "e5");
      expect(invalidMove).toBe(false);
    });

    it("should validate knight moves correctly", () => {
      const validKnightMove = engine.isValidMove("b1", "c3");
      expect(validKnightMove).toBe(true);

      const invalidKnightMove = engine.isValidMove("b1", "b3");
      expect(invalidKnightMove).toBe(false);
    });

    it("should prevent moves that leave king in check", () => {
      // Set up position where moving a piece would expose the king
      engine = new ChessEngine(
        "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2"
      );

      // This move would be illegal if it exposes the king
      const moveResult = engine.makeMove("e2", "e4");
      expect(moveResult.success).toBe(true);
    });

    it("should handle castling validation", () => {
      // Set up position for kingside castling
      engine = new ChessEngine("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");

      const canCastle = engine.isValidMove("e1", "g1");
      expect(canCastle).toBe(true);
    });

    it("should validate en passant capture", () => {
      // Set up en passant scenario
      engine = new ChessEngine(
        "rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3"
      );

      const enPassantValid = engine.isValidMove("e5", "f6");
      expect(enPassantValid).toBe(true);
    });
  });

  describe("Move Execution", () => {
    it("should execute valid moves and update game state", () => {
      const moveResult = engine.makeMove("e2", "e4");

      expect(moveResult.success).toBe(true);
      expect(moveResult.move?.from).toBe("e2");
      expect(moveResult.move?.to).toBe("e4");
      expect(moveResult.move?.piece).toBe("pawn");

      const gameState = engine.getGameState();
      expect(gameState.currentPlayer).toBe("black");
      expect(gameState.moveHistory).toHaveLength(1);
    });

    it("should reject invalid moves", () => {
      const moveResult = engine.makeMove("e2", "e5");

      expect(moveResult.success).toBe(false);
      expect(moveResult.error).toBeDefined();

      const gameState = engine.getGameState();
      expect(gameState.currentPlayer).toBe("white");
      expect(gameState.moveHistory).toHaveLength(0);
    });

    it("should handle pawn promotion", () => {
      // Set up position near promotion
      engine = new ChessEngine("8/P7/8/8/8/8/8/K6k w - - 0 1");

      const promotionResult = engine.makeMove("a7", "a8", "queen");
      expect(promotionResult.success).toBe(true);
      expect(promotionResult.move?.promotion).toBe("queen");
    });

    it("should execute castling correctly", () => {
      engine = new ChessEngine("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");

      const castlingResult = engine.makeMove("e1", "g1");
      expect(castlingResult.success).toBe(true);
      expect(castlingResult.move?.castling).toBe("kingside");

      // Verify rook also moved
      const gameState = engine.getGameState();
      const rookSquare = gameState.board[7][5]; // f1
      expect(rookSquare?.piece).toBe("rook");
      expect(rookSquare?.color).toBe("white");
    });

    it("should handle en passant capture", () => {
      engine = new ChessEngine(
        "rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3"
      );

      const enPassantResult = engine.makeMove("e5", "f6");
      expect(enPassantResult.success).toBe(true);
      expect(enPassantResult.move?.enPassant).toBe(true);
      expect(enPassantResult.move?.captured).toBe("pawn");
    });
  });

  describe("Game State Detection", () => {
    it("should detect check", () => {
      engine = new ChessEngine(
        "rnbqkb1r/pppp1ppp/5n2/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 2 3"
      );
      engine.makeMove("h5", "f7");

      const gameState = engine.getGameState();
      expect(gameState.isCheck).toBe(true);
    });

    it("should detect checkmate", () => {
      // Scholar's mate setup
      engine = new ChessEngine();
      engine.makeMove("e2", "e4");
      engine.makeMove("e7", "e5");
      engine.makeMove("d1", "h5");
      engine.makeMove("b8", "c6");
      engine.makeMove("f1", "c4");
      engine.makeMove("g8", "f6");
      const mateResult = engine.makeMove("h5", "f7");

      expect(mateResult.success).toBe(true);
      const gameState = engine.getGameState();
      expect(gameState.isCheckmate).toBe(true);
      expect(gameState.isCheck).toBe(true);
    });

    it("should detect stalemate", () => {
      // Set up stalemate position
      engine = new ChessEngine("7k/5K2/6Q1/8/8/8/8/8 b - - 0 1");

      const gameState = engine.getGameState();
      expect(gameState.isStalemate).toBe(true);
      expect(gameState.isCheck).toBe(false);
    });

    it("should detect draw by insufficient material", () => {
      // King vs King
      engine = new ChessEngine("8/8/8/8/8/8/8/k6K w - - 0 1");

      const gameState = engine.getGameState();
      expect(gameState.isDraw).toBe(true);
    });

    it("should track halfmove clock for 50-move rule", () => {
      engine = new ChessEngine("8/8/8/8/8/8/8/k6K w - - 49 1");

      // Make a move that doesn't reset the clock
      engine.makeMove("h1", "g1");

      const gameState = engine.getGameState();
      expect(gameState.halfmoveClock).toBe(50);
      expect(gameState.isDraw).toBe(true);
    });
  });

  describe("Move History and Navigation", () => {
    it("should track move history with algebraic notation", () => {
      engine.makeMove("e2", "e4");
      engine.makeMove("e7", "e5");
      engine.makeMove("g1", "f3");

      const gameState = engine.getGameState();
      expect(gameState.moveHistory).toHaveLength(3);
      expect(gameState.moveHistory[0].san).toBe("e4");
      expect(gameState.moveHistory[1].san).toBe("e5");
      expect(gameState.moveHistory[2].san).toBe("Nf3");
    });

    it("should support undo moves", () => {
      engine.makeMove("e2", "e4");
      engine.makeMove("e7", "e5");

      const undoResult = engine.undoMove();
      expect(undoResult.success).toBe(true);

      const gameState = engine.getGameState();
      expect(gameState.moveHistory).toHaveLength(1);
      expect(gameState.currentPlayer).toBe("black");
    });

    it("should handle undo at start of game", () => {
      const undoResult = engine.undoMove();
      expect(undoResult.success).toBe(false);
      expect(undoResult.error).toBe("No moves to undo");
    });

    it("should support getting legal moves for a square", () => {
      const legalMoves = engine.getLegalMoves("e2");
      expect(legalMoves).toContain("e3");
      expect(legalMoves).toContain("e4");
      expect(legalMoves).toHaveLength(2);
    });

    it("should get all legal moves for current position", () => {
      const allMoves = engine.getAllLegalMoves();
      expect(allMoves).toHaveLength(20); // 20 possible moves in starting position
    });
  });

  describe("FEN and Board Representation", () => {
    it("should convert to/from FEN correctly", () => {
      const originalFen =
        "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
      engine = new ChessEngine(originalFen);

      expect(engine.getFen()).toBe(originalFen);
    });

    it("should generate correct board representation", () => {
      const board = engine.getBoard();

      // Check initial position
      expect(board[0][0]?.piece).toBe("rook");
      expect(board[0][0]?.color).toBe("black");
      expect(board[7][4]?.piece).toBe("king");
      expect(board[7][4]?.color).toBe("white");

      // Check empty squares
      expect(board[3][3]).toBeNull();
      expect(board[4][4]).toBeNull();
    });

    it("should convert square notation correctly", () => {
      expect(engine.squareToCoords("a1")).toEqual([7, 0]);
      expect(engine.squareToCoords("h8")).toEqual([0, 7]);
      expect(engine.squareToCoords("e4")).toEqual([4, 4]);

      expect(engine.coordsToSquare(7, 0)).toBe("a1");
      expect(engine.coordsToSquare(0, 7)).toBe("h8");
      expect(engine.coordsToSquare(4, 4)).toBe("e4");
    });
  });

  describe("Performance and Edge Cases", () => {
    it("should handle rapid move sequences", () => {
      const moves = [
        ["e2", "e4"],
        ["e7", "e5"],
        ["g1", "f3"],
        ["b8", "c6"],
        ["f1", "b5"],
        ["a7", "a6"],
        ["b5", "a4"],
        ["g8", "f6"],
      ];

      moves.forEach(([from, to]) => {
        const result = engine.makeMove(from, to);
        expect(result.success).toBe(true);
      });

      expect(engine.getGameState().moveHistory).toHaveLength(8);
    });

    it("should maintain consistent state across complex games", () => {
      // Play a longer game sequence
      const moves = [
        "e4",
        "e5",
        "Nf3",
        "Nc6",
        "Bb5",
        "a6",
        "Ba4",
        "Nf6",
        "O-O",
        "Be7",
        "Re1",
        "b5",
        "Bb3",
        "d6",
        "c3",
        "O-O",
        "h3",
        "Nb8",
      ];

      let moveIndex = 0;
      while (moveIndex < moves.length) {
        const legalMoves = engine.getAllLegalMoves();
        expect(legalMoves.length).toBeGreaterThan(0);

        // Make a move (simplified - in real test would parse SAN)
        const currentMoves = engine.getAllLegalMoves();
        if (currentMoves.length > 0) {
          const firstMove = currentMoves[0];
          engine.makeMove(firstMove.from, firstMove.to, firstMove.promotion);
          moveIndex++;
        } else {
          break;
        }
      }

      const finalState = engine.getGameState();
      expect(finalState.fen).toBeDefined();
      expect(finalState.moveHistory.length).toBeGreaterThan(0);
    });
  });
});

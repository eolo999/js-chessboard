var debugging_object;
var board = {};

/**
 * Creates an array of 128 zeroes.
 * @return {Array.<number>} An array of 128 zeroes.
 */
board.initZerosArray = function() {
    var result = [];
    for (var i = 0; i < 0x80; i++) {
        result.push(0);
    }
    return result;
};


/**
 * String representation of all columns.
 * @type {string}
 * @const
 */
board.COLUMNS = 'abcdefgh';


/**
 * Defines a binary color table for squares.
 * @type {Object.<number, string>}
 * @const
 */
board.COLOR = { 0: 'white', 1: 'black' };


/**
 * Defines the color of each board square.
 * @type {Array.<number>}
 * @const
 */
board.COLORS = [
    1, 0, 1, 0, 1, 0, 1, 0, -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 0, 1, 0, 1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1,
    1, 0, 1, 0, 1, 0, 1, 0, -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 0, 1, 0, 1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1,
    1, 0, 1, 0, 1, 0, 1, 0, -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 0, 1, 0, 1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1,
    1, 0, 1, 0, 1, 0, 1, 0, -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 0, 1, 0, 1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1];


/**
 * Represents pieces positions on the board.
 * @type {Array.<(number|string)>}
 */


/**
 * Table of pieces' algebraic notation names and full pieces' names.
 * @type {Object.<string, string>}
 * @const
 */
board.piecesAbbreviation = {
    P: 'pawn',
    p: 'pawn',
    N: 'knight',
    n: 'knight',
    B: 'bishop',
    b: 'bishop',
    R: 'rook',
    r: 'rook',
    Q: 'queen',
    q: 'queen',
    K: 'king',
    k: 'king'
};


/** Table of move directions deltas.
 * @type {Object.<string, number>}
 * @const
 */
board.moveDirectionDelta = {
    north: 0x10,
    north_east: 0x11,
    east: 0x1,
    south_east: -0xf,
    south: -0x10,
    south_west: -0x11,
    west: -0x1,
    north_west: 0xf,
};


/**
 * Checks wether a square is on the left side of the 0x88 board (the valid
 * side).
 *
 * @param {number} square The square number.
 * @return {boolean} True if square is on board, false otherwise.
 */
board.onBoard = function(square) {
    return (square & 0x88) == 0;
};

/**
 * Get the column number of a square starting from 0.
 *
 * @param {number} square The square.
 * @return {number} The square's column.
 */
board.getColumn = function(square) {
    return square & 0x7;
};


/**
 * Get the rank number of a square starting from 0.
 *
 * @param {number} square The square.
 * @return {number} The square's rank.
 */
board.getRank = function(square) {
    return square >> 4;
};


/**
 * Translates a square number into algebraic notation.
 *
 * @param {number} square The square.
 * @return {string} The square in algebraic notation.
 */
board.numberToAlgebraic = function(square) {
    if (board.onBoard(square)) {
        var column = square & 0x7;
        var rank = board.getRank(square);
        return board.COLUMNS[column] + (rank + 1);
    }
    return;
};


/**
 * Translates the algebraic notation string of a square into its corresponding
 * board number.
 *
 * @param {string} square The algebraic notation string.
 * @return {number} The square index in the board array.
 */
board.algebraicToNumber = function(square) {
    var column_char = square[0];
    var rank_char = square[1];
    if (board.COLUMNS.indexOf(column_char) == -1 ||
            rank_char <= 0 || rank_char > 8) {
                return;
            }
    var column = board.COLUMNS.indexOf(column_char);
    var rank = rank_char - 1;
    return (0x10 * rank) + column;
};


/**
 * Get the color of a piece.
 *
 * @param {string} piece_abbr The piece name in algebraic notation.
 * @return {'w'|'b'} White or Black.
 */
board.getPieceColor = function(piece_abbr) {
    if (piece_abbr == piece_abbr.toUpperCase()) {
        return 'w';
    } else {
        return 'b';
    }
};


/**
 * Initialize the validMovesTable with all valid moves of minor and major
 * pieces (pawns excluded).
 */
board.generateValidMovesTable = function() {
    var validMovesTable = {
        pawn: {},
        knight: {},
        bishop: {},
        rook: {},
        queen: {},
        king: {}
    };

    var piece_function = {
        knight: board.validKnightMoves,
        bishop: board.validBishopMoves,
        rook: board.validRookMoves,
        queen: board.validQueenMoves,
        king: board.validKingMoves
    };
    for (var index = 0; index < 0x80; index++) {
        if (board.onBoard(index)) {
            for (var piece in piece_function) {
                validMovesTable[piece][index] = piece_function[piece](index);
            }
        }
    }
    return validMovesTable;
};


/**
 * Calculate the valid destination squares of a sliding (Bishops, Rooks, Queen)
 * piece starting from a given square and given its move deltas.
 *
 * @param {number} start The starting square.
 * @param {Array.<number>} move_deltas All possible move's directions.
 * @return {Array.<number>} The array of all valid destination squares.
 */
board.validSlidingMoves = function(start, move_deltas) {
    var moves = [];
    for (var index = 0; index < move_deltas.length; index++) {
        var delta = move_deltas[index];
        var current_square = start + delta;
        while (board.onBoard(current_square)) {
            moves.push(current_square);
            current_square += delta;
        }
    }
    return moves;
};


/**
 * Calculate the valid destination squares of a not-sliding (King, Knights)
 * piece starting from a given square and given its move deltas.
 *
 * @param {number} start The starting square.
 * @param {Array.<number>} move_deltas All possible move's directions.
 * @return {Array.<number>} The array of all valid destination squares.
 */
board.validNotSlidingMoves = function(start, move_deltas) {
    var moves = [];
    for (var index = 0; index < move_deltas.length; index++) {
        var delta = move_deltas[index];
        var end = start + delta;
        if (board.onBoard(end)) {
            moves.push(end);
        }
    }
    return moves;
};


/**
 * Calculate the valid destination squares of a Bishop starting from a given
 * square.
 *
 * @param {number} start The starting square.
 * @return {Array.<number>} The array of all valid destination squares.
 */
board.validBishopMoves = function(start) {
    var move_deltas = [
        board.moveDirectionDelta.north_west,
        board.moveDirectionDelta.north_east,
        board.moveDirectionDelta.south_west,
        board.moveDirectionDelta.south_east,
    ];
    return board.validSlidingMoves(start, move_deltas);
};


/**
 * Calculate the valid destination squares of a Rook starting from a given
 * square.
 *
 * @param {number} start The starting square.
 * @return {Array.<number>} The array of all valid destination squares.
 */
board.validRookMoves = function(start) {
    var move_deltas = [
        board.moveDirectionDelta.north,
        board.moveDirectionDelta.south,
        board.moveDirectionDelta.east,
        board.moveDirectionDelta.west,
    ];
    return board.validSlidingMoves(start, move_deltas);
};


/**
 * Calculate the valid destination squares of a Queen starting from a given
 * square.
 *
 * It just sums up Rook moves and Bishop moves.
 *
 * @param {number} start The starting square.
 * @return {Array.<number>} The array of all valid destination squares.
 */
board.validQueenMoves = function(start) {
    return board.validBishopMoves(start).concat(board.validRookMoves(start));
};


/**
 * Calculate the valid destination squares of a Knight starting from a given
 * square.
 *
 * @param {number} start The starting square.
 * @return {Array.<number>} The array of all valid destination squares.
 */
board.validKnightMoves = function(start) {
    var move_deltas = [14, 18, 31, 33, -14 , -18, -31, -33];
    return board.validNotSlidingMoves(start, move_deltas);
};

/**
 * Calculate the valid destination squares of a King starting from a given
 * square.
 *
 * @param {number} start The starting square.
 * @return {Array.<number>} The array of all valid destination squares.
 */
board.validKingMoves = function(start) {
    var move_deltas = [
        board.moveDirectionDelta.north,
        board.moveDirectionDelta.south,
        board.moveDirectionDelta.east,
        board.moveDirectionDelta.west,
        board.moveDirectionDelta.north_west,
        board.moveDirectionDelta.north_east,
        board.moveDirectionDelta.south_west,
        board.moveDirectionDelta.south_east,
    ];
    return board.validNotSlidingMoves(start, move_deltas);
};

board.validateFEN = function(fen_string) {
    function validatePiecesPosition(pieces_position) {
        var ranks = pieces_position.split('/');
        // eigth fields one per rank separated by a '/'
        if (ranks.length != 8) {
            return false;
        }

        for (var i = 0; i < ranks.length; i++) {
            var sum_fields = 0;
            var previous_was_number = false;

            for (var k = 0; k < ranks[i].length; k++) {
                if (!isNaN(ranks[i][k])) {
                    if (previous_was_number) {
                        return false;
                    }
                    sum_fields += parseInt(ranks[i][k]);
                    previous_was_number = true;
                } else {
                    if (!/^[prnbqkPRNBQK]$/.test(ranks[i][k])) {
                        return false;
                    }
                    sum_fields += 1;
                    previous_was_number = false;
                }
            }
            if (sum_fields != 8) {
                return false;
            }
        }
        return true;
    }

    function validateActiveColor(active_color) {
        if (active_color == 'w' || active_color == 'b') {
            return true;
        } else {
            return false;
        }
    }

    function validateCastling(castling) {
        if (!(/^(K?Q?k?q?|-)$/.test(castling) && (castling.length > 0))) {
            return false;
        } else {
            return true;
        }
    }

    function validateEnPassant(enpassant) {
        if (!/^(-|[abcdefgh][36])$/.test(enpassant)) {
            return false;
        } else {
            return true;
        }
    }

    function validateHalfmoveClock(halfmove_clock) {
        if (isNaN(halfmove_clock) || (parseInt(halfmove_clock, 10) < 0)) {
            return false;
        } else {
            return true;
        }
    }

    function validateFullmoveNumber(fullmove_number) {
        if (isNaN(fullmove_number) || (parseInt(fullmove_number, 10) <= 0)) {
            return {valid: false, error_number: 2, error: errors[2]};
        } else {
            return true;
        }
    }

    var fen = fen_string.split(/\s+/);
    if (fen.length != 6) {
        alert("FEN is more than 6 fields");
        return false;
    }

    var pieces_position = fen[0];
    if (!validatePiecesPosition(pieces_position)) {
        alert("FEN has wrong piece positions");
        return false;
    }

    var active_color = fen[1];
    if (!validateActiveColor(active_color)) {
        alert("FEN has wrong active color field");
        return false;
    }

    var castling = fen[2];
    if (!validateCastling(castling)) {
        alert("FEN has wrong castling field");
        return false;
    }
    var enpassant = fen[3];
    if (!validateEnPassant(enpassant)) {
        alert("FEN has wrong enpassant field");
        return false;
    }

    var halfmove_clock = fen[4];
    if (!validateHalfmoveClock(halfmove_clock)) {
        alert("FEN has wrong halfmove clock field");
        return false;
    }

    var fullmove_number = fen[5];
    if (!validateFullmoveNumber(fullmove_number)) {
        alert("FEN has wrong fullmove field");
        return false;
    }
    return true;
};


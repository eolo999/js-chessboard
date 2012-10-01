var debugging_object;
var board = new Object();
board.position = new Object();

/** Creates an array of 128 zeroes.
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
    0, 1, 0, 1, 0, 1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1,
    1, 0, 1, 0, 1, 0, 1, 0, -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 0, 1, 0, 1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1,
    1, 0, 1, 0, 1, 0, 1, 0, -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 0, 1, 0, 1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1,
    1, 0, 1, 0, 1, 0, 1, 0, -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 0, 1, 0, 1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1,
    1, 0, 1, 0, 1, 0, 1, 0, -1, -1, -1, -1, -1, -1, -1, -1];

/**
 * Represents pieces positions on the board.
 * @type {Array.<(number|string)>}
 */
board.position.pieces = board.initZerosArray();

board.piecesAbbreviation = {
    'P': 'pawn',
    'p': 'pawn',
    'N': 'knight',
    'n': 'knight',
    'B': 'bishop',
    'b': 'bishop',
    'R': 'rook',
    'r': 'rook',
    'Q': 'queen',
    'q': 'queen',
    'K': 'king',
    'k': 'king'
};


board.validMovesTable = {
    'pawn': new Object(),
    'knight': new Object(),
    'bishop': new Object(),
    'rook': new Object(),
    'queen': new Object(),
    'king': new Object()
};


/** Empties the board from every piece.
 * @type {function()}
 */
board.resetPieces = function() {
    board.position.pieces = board.initZerosArray();
};

/**
 * Checks wether a square is on the left side of the 0x88 board (the valid
 * side).
 * @param {number} square The square number.
 * @return {boolean} True if square is on board, false otherwise.
 */
board.onBoard = function(square) {
    return (square & 0x88) == 0;
};

board.getColumn = function(square) {
    return square & 0x7;
};

board.getRank = function(square) {
    return square >> 4;
};

board.numberToAlgebraic = function(square) {
    var column = square & 0x7;
    var rank = board.getRank(square);
    return board.COLUMNS[column] + (rank + 1);
};

board.algebraicToNumber = function(square) {
    var column = board.COLUMNS.indexOf(square[0]);
    var rank = square[1] - 1;
    return (0x10 * rank) + column;
};

board.getPieceColor = function(piece_abbr) {
    if (piece_abbr == piece_abbr.toUpperCase()) {
        return 'w';
    } else {
        return 'b';
    }
};

board.position.toggleTrait = function() {
    if (board.position.trait == 'w') {
        board.position.trait = 'b';
    } else {
        board.position.trait = 'w';
    }
};

board.removeCaptured = function(square) {
    board.position.pieces[square] = 0;
};

/**
 * Place the pieces on the board according to a FEN string if given otherwise
 * place pieces in default starting position.
 * @param {string=} fen_string A game position in Forsyth–Edwards Notation
 * (optional).
 */
board.setupFromFen = function(fen_string) {
    function validateFEN(fen_string) {
        return true;
    }

    function setupPieces(rows_string) {
        var rows = rows_string.split('/').reverse();
        for (var row_index = 0; row_index < 8; row_index++) {
            var square = row_index * 0x10;
            for (var index = 0;
                    index < rows[row_index].length; index++) {
                var letter = rows[row_index][index];
                if (isNaN(letter)) {
                    board.position.pieces[square] = letter;
                    square += 1;
                } else {
                    square += parseInt(letter, 10);
                }
            }
        }
    }

    function setupPosition(attribute, value) {
        board.position[attribute] = value;
    }

    if (fen_string == undefined) {
        fen_string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
    if (validateFEN(fen_string)) {
        var fen_array = fen_string.split(' ');
        setupPieces(fen_array[0]);
        setupPosition('trait', fen_array[1]);
        setupPosition('castling', fen_array[2]);
        setupPosition('enpassant', fen_array[3]);
        setupPosition('halfmove', fen_array[4]);
        setupPosition('fullmove', fen_array[5]);
    }
};

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

board.validBishopMoves = function(start) {
    var move_deltas = [17, 15, -17, -15];
    return board.validSlidingMoves(start, move_deltas);
};

board.validRookMoves = function(start) {
    var move_deltas = [16, 1, -16, -1];
    return board.validSlidingMoves(start, move_deltas);
};

board.validQueenMoves = function(start) {
    return board.validBishopMoves(start).concat(board.validRookMoves(start));
};

board.validKnightMoves = function(start) {
    var move_deltas = [14, 18, 31, 33, -14 , -18, -31, -33];
    return board.validNotSlidingMoves(start, move_deltas);
};

board.validKingMoves = function(start) {
    var move_deltas = [16, 17, 1, -15, -16, -17, -1, 15];
    return board.validNotSlidingMoves(start, move_deltas);
};


/**
 * Calculate and set in validMovesTable the array of valid moves for this
 * particular pawn.
 *
 * Pawn valid moves depend deeply from context:
 *
 * 1) White and Black pawns move in opposite direction.
 * 2) Can capture on the diagonal squares ahead if occupied by opposite color
 *    pieces.
 * 3) Cannot capture straight ahead.
 * 3) Can move 2 ranks ahead if in their starting position.
 * 4) Can capture 'en passant' (TODO).
 *
 * For simplicity sake we recalculate the array on every pawn move.
 *
 * @param {string} color 'w' | 'b' the moving piece color.
 * @param {number} start The starting square.
 */
board.validPawnMoves = function(color, start) {
        var rank_delta = 0x10;
        var step, diagonals = [];
        var moves = [];
        if (color == 'w') {
            diagonals = [15, 17];
            if (board.position.pieces[start + rank_delta] == 0) {
                step = [start + rank_delta];
            }
            if (board.getRank(start) == 1) {
                step = step.concat([start + (rank_delta * 2)]);
            }
        } else {
            diagonals = [-15, -17];
            if (board.position.pieces[start - rank_delta] == 0) {
                step = [start - rank_delta];
            }
            if (board.getRank(start) == 6) {
                step = step.concat([start - (rank_delta * 2)]);
            }
        }
        for (var delta in diagonals) {
            if (board.position.pieces[start + diagonals[delta]] != 0) {
                moves.push(start + diagonals[delta]);
            }
        }
        moves = moves.concat(step);
        board.validMovesTable['pawn'][start] = moves;
};

board.generateValidMovesTable = function() {
    var piece_function = {
        'knight': board.validKnightMoves,
        'bishop': board.validBishopMoves,
        'rook': board.validRookMoves,
        'queen': board.validQueenMoves,
        'king': board.validKingMoves
    };
    for (var index = 0; index < 0x80; index++) {
        if (board.onBoard(index)) {
            for (var piece in piece_function) {
                board.validMovesTable[piece][index] =
                    piece_function[piece](index);
            }
        }
    }
};

/**
 * Checks if a move is valid.
 *
 * Constraints:
 *
 * 1) Cannot move when it's not your turn.
 * 2) Cannot capture same color pieces.
 * 3) Cannot capture the King.
 * 4) Pawn valid moves change depending on context.
 * 5) Cannot move on unreachable square for a given piece.
 * 6) King can castle. (TODO)
 * 7) All pieces except Knights cannot jump over obstacles. (TODO)
 * 8) Must remove check if King is under attack. (TODO)
 * 9) Cannot move pinned pieces. (TODO)
 * 10) Handle pawn promotions. (TODO)
 *
 * @param {string|number} start The starting square.
 * @param {string|number} end The destination square.
 * @return {boolean} Wether the move has been done or not.
 */
board.makeMove = function(start, end) {
    start = parseInt(start, 10);
    var moving_piece_abbr = board.position.pieces[start];
    var moving_piece = board.piecesAbbreviation[moving_piece_abbr];
    var moving_piece_color = board.getPieceColor(moving_piece_abbr);
    // Do not move when it's not your turn
    if (moving_piece_color != board.position.trait) {
        return false;
    }
    var captured_piece_abbr = board.position.pieces[end];
    // Do not capture same color pieces
    if (captured_piece_abbr != 0 &&
            board.getPieceColor(captured_piece_abbr) == moving_piece_color) {
        return false;
    }
    // Cannot capture king
    if (captured_piece_abbr == 'K' || captured_piece_abbr == 'k') {
        return false;
    }
    // Regenerate valid moves array for the moving pawn
    if (moving_piece == 'pawn') {
        board.validPawnMoves(moving_piece_color, start);
    }
    // Do not move on an unreachable square
    if (board.validMovesTable[moving_piece][start].indexOf(end) == -1) {
        return false;
    }

    // DO MOVE
    board.position.pieces[start] = 0;
    if (captured_piece_abbr != 0) {
        board.removeCaptured(end);
    }
    board.position.pieces[end] = moving_piece_abbr;
    board.position.toggleTrait();
    return true;
};


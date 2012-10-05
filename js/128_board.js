var debugging_object;
var board = new Object();


/**
 * Stores the actual position on the board.
 *
 * Attributes:
 *   1) pieces
 *   2) trait
 *   3) castling capabilities
 *   4) enpassant
 *   5) halfmove
 *   6) fullmove
 *
 * @type {Object}
 */
board.position = new Object();
board.position.castling = new Object();

/**
 * Creates an array of 128 zeroes.
 *
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
 *
 * @type {string}
 * @const
 */
board.COLUMNS = 'abcdefgh';


/**
 * Defines a binary color table for squares.
 *
 * @type {Object.<number, string>}
 * @const
 */
board.COLOR = { 0: 'white', 1: 'black' };


/**
 * Defines the color of each board square.
 *
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
 *
 * @type {Array.<(number|string)>}
 */
board.position.pieces = board.initZerosArray();


/**
 * Table of pieces' algebraic notation names and full pieces' names.
 *
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
 *
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
 * After being initialized with generateValidMovesTable it contains all the
 * valid squares for a given piece starting from a given square.
 *
 * @type {Object.<string, Array.<number>>
 */
board.validMovesTable = {
    pawn: new Object(),
    knight: new Object(),
    bishop: new Object(),
    rook: new Object(),
    queen: new Object(),
    king: new Object()
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
 * Toggles board.position.trait from 'w' to 'b' and vice versa.
 */
board.position.toggleTrait = function() {
    if (board.position.trait == 'w') {
        board.position.trait = 'b';
    } else {
        board.position.trait = 'w';
    }
    return board.position.trait;
};


/**
 * Reset to zero the given square.
 *
 * @param {number} square The square.
 */
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
        board.resetPieces();
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

    function setupCastling(castling_string) {
        var white = '';
        var black = '';
        for (var index = 0; index < castling_string.length; index++) {
            var letter = castling_string[index];
            if (letter == letter.toUpperCase()) {
                white += letter.toLowerCase();
            } else {
                black += letter;
            }
        }
        board.position.castling.w = white;
        board.position.castling.b = black;
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
        setupCastling(fen_array[2]);
        setupPosition('enpassant', board.algebraicToNumber(fen_array[3]));
        setupPosition('halfmove', fen_array[4]);
        setupPosition('fullmove', fen_array[5]);
    }
};


/**
 * Initialize the validMovesTable with all valid moves of minor and major
 * pieces (pawns excluded).
 */
board.generateValidMovesTable = function() {
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
                board.validMovesTable[piece][index] =
                    piece_function[piece](index);
            }
        }
    }
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
 * 4) Can capture 'en passant'.
 *
 * For simplicity sake we recalculate the array on every pawn move.
 *
 * @param {string} color 'w' | 'b' the moving piece color.
 * @param {number} start The starting square.
 */
board.validPawnMoves = function(color, start) {
    var rank_delta = 0x10;
    var step = [];
    var diagonals = [];
    var moves = [];
    if (color == 'w') {
        diagonals = [
            board.moveDirectionDelta.north_west,
            board.moveDirectionDelta.north_east
        ];
        // Cannot capture straight ahead.
        if (board.position.pieces[start + rank_delta] == 0) {
            step = [start + rank_delta];
            // Can step 2 squares ahead when on 2nd rank.
            if (board.getRank(start) == 1) {
                if (board.position.pieces[start + (rank_delta * 2)] == 0) {
                    step = step.concat([start + (rank_delta * 2)]);
                }
            }
        }
    } else {
        diagonals = [
            board.moveDirectionDelta.south_west,
            board.moveDirectionDelta.south_east
        ];
        // Cannot capture straight ahead.
        if (board.position.pieces[start - rank_delta] == 0) {
            step = [start - rank_delta];
            // Can step 2 squares ahead when on 7th rank.
            if (board.getRank(start) == 6) {
                if (board.position.pieces[start - (rank_delta * 2)] == 0) {
                    step = step.concat([start - (rank_delta * 2)]);
                }
            }
        }
    }
    for (var delta in diagonals) {
        if ((board.position.pieces[start + diagonals[delta]] != 0) ||
                (start + diagonals[delta] == board.position.enpassant)) {
            moves.push(start + diagonals[delta]);
        }
    }
    moves = moves.concat(step);
    board.validMovesTable['pawn'][start] = moves;
};


/**
 * Make moves defining start and end squares in algebraic notation.
 *
 * @param {string} start The start square in algebraic notation.
 * @param {string} end The end square in algebraic notation.
 * @return {boolean} Wether the move has been done or not.
 */
board.makeAlgebraicMove = function(start, end) {
    return board.makeMove(board.algebraicToNumber(start),
            board.algebraicToNumber(end));
};


/**
 * Checks if a move is valid.
 *
 * Rules & Constraints:
 *
 * 1) Cannot move when it's not your turn.
 * 2) Cannot capture same color pieces.
 * 3) Cannot capture the King.
 * 4) Pawn valid moves change depending on context.
 * 5) Cannot move on unreachable square for a given piece.
 * 6) Pawns can capture en passant.
 * 7) King can castle.
 * 8) All pieces except Knights cannot jump over obstacles. (TODO)
 * 9) Must remove check if King is under attack. (TODO)
 * 10) Cannot move pinned pieces. (TODO)
 * 11) Handle pawn promotions. (TODO)
 *
 * @param {string|number} start The starting square.
 * @param {string|number} end The destination square.
 * @return {boolean} Wether the move has been done or not.
 */
board.makeMove = function(start, end) {
    start = parseInt(start, 10);
    end = parseInt(end, 10);
    if (start == end) {
        return false;
    }
    var moving_piece_abbr = board.position.pieces[start];
    // Start square is empty
    if (moving_piece_abbr == 0) {
        return false;
    }
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

    // Castling
    if (board.handleCastling(moving_piece_abbr, moving_piece_color, start, end)) {
        board.position.castling[moving_piece_color] = '';
        board.position.toggleTrait();
        return true;
    }

    // Do not move on an unreachable square
    if (board.validMovesTable[moving_piece][start].indexOf(end) == -1) {
        return false;
    }

    // Sliding pieces cannot go after an obstacle
    if (board.hasObstacles(moving_piece_abbr, start, end)) {
        return false;
    }

    // ======= //
    // DO MOVE //
    // ======= //

    // Handle normal and en passant capture
    board.handleCapture(moving_piece_abbr, captured_piece_abbr, start, end);

    // Set the enpassant square if needed
    board.setEnPassantSquare(moving_piece_abbr, start, end);

    // Set castling capabilities
    board.setCastling(moving_piece_abbr, start);

    // Pawn Promotion
    moving_piece_abbr = board.handlePawnPromotion(moving_piece_abbr, end);

    board.position.pieces[start] = 0;
    board.position.pieces[end] = moving_piece_abbr;
    board.position.toggleTrait();
    return true;
};


board.hasObstacles = function(piece, start, end) {
    function hasRookObstacles(start, end) {
        var delta = start - end;
        if (delta % 0x10 == 0) {
            var direction = 0x10
        } else {
            var direction = 0x1;
        }
        var distance = delta / direction;
        for (var index = 1; index < Math.abs(distance); index ++) {
            if (distance < 0) {
                var square = start + (index * direction);
            } else {
                var square = start + (index * -direction);
            }
            if (board.position.pieces[square] != 0) {
                return true;
            }
        }
        return false;
    }

    function hasBishopObstacles(start, end) {
        var delta = start - end;
        if (delta % 0x11 == 0) {
            var direction = 0x11
        } else {
            var direction = 0xf
        }
        var distance = delta / direction;
        for (var index = 1; index < Math.abs(distance); index ++) {
            if (distance < 0) {
                var square = start + (index * direction);
            } else {
                var square = start + (index * -direction);
            }
            if (board.position.pieces[square] != 0) {
                return true;
            }
        }
        return false;
    }

    if (piece.toUpperCase() == 'R') {
        return hasRookObstacles(start, end);
    }
    if (piece.toUpperCase() == 'B') {
        return hasBishopObstacles(start, end);
    }
    if (piece.toUpperCase() == 'Q') {
        var delta = start - end;
        if (delta % 0x11 == 0 || delta % 0xf == 0) {
            return hasBishopObstacles(start, end);
        } else {
            return hasRookObstacles(start, end);
        }
    }
    return false;
};


board.setCastling = function(piece, start) {
    if (piece == 'K') {
        board.position.castling['w'] = '';
    }
    if (piece == 'k') {
        board.position.castling['b'] = '';
    }
    if (piece == 'R' && start == 0) {
        board.position.castling['w'] = board.position.castling['w'].replace('q', '');
    }
    if (piece == 'R' && start == 7) {
        board.position.castling['w'] = board.position.castling['w'].replace('k', '');
    }
    if (piece == 'r' && start == 0x70) {
        board.position.castling['b'] = board.position.castling['b'].replace('q', '');
    }
    if (piece == 'r' && start == 0x77) {
        board.position.castling['b'] = board.position.castling['b'].replace('k', '');
    }
};


/**
 * Performs castlings
 */
board.handleCastling = function(piece, color, start, end) {
    if (piece.toUpperCase() != 'K') {
        return false;
    }

    function castleKingSide(start, end) {
        board.position.pieces[start] = 0;
        board.position.pieces[end] = piece;
        if (color == 'w') {
            board.position.pieces[7] = 0;
            board.position.pieces[5] = 'R';
        } else {
            board.position.pieces[0x77] = 0;
            board.position.pieces[0x75] = 'r';
        }
    }

    function castleQueenSide(start, end) {
        board.position.pieces[start] = 0;
        board.position.pieces[end] = piece;
        if (color == 'w') {
            board.position.pieces[0] = 0;
            board.position.pieces[3] = 'R';
        } else {
            board.position.pieces[0x70] = 0;
            board.position.pieces[0x73] = 'r';
        }
    }

    var castling_capabilities = board.position.castling[color];
    if (start - end == 2 && castling_capabilities.indexOf('q') != -1) {
        if (color == 'w' &&
                board.position.pieces[1] == 0 &&
                board.position.pieces[2] == 0 &&
                board.position.pieces[3] == 0 ) {
                    castleQueenSide(start, end);
                    return true;
        }
        if (color == 'b' &&
                board.position.pieces[0x71] == 0 &&
                board.position.pieces[0x72] == 0 &&
                board.position.pieces[0x73] == 0 ) {
                    castleQueenSide(start, end);
                    return true;
        }
    }
    if (start - end == -2 && castling_capabilities.indexOf('k') != -1) {
        if (color == 'w' &&
                board.position.pieces[5] == 0 &&
                board.position.pieces[6] == 0 ) {
                    castleKingSide(start, end);
                    return true;
        }
        if (color == 'b' &&
                board.position.pieces[0x75] == 0 &&
                board.position.pieces[0x76] == 0 ) {
                    castleKingSide(start, end);
                    return true;
        }
    }
    return false;
};


/**
 * Handle normal and en passant captures.
 *
 * @param {string} moving_piece_abbr The moving piece in algebraic representation.
 * @param {string} captured_piece_abbr The captured piece in algebraic representation.
 * @param {number} start The starting square number.
 * @param {number} end The ending square number.
 */
board.handleCapture =function(moving_piece_abbr, captured_piece_abbr, start, end) {
    if (captured_piece_abbr != 0) {
        board.removeCaptured(end);
    } else {
        // En passant capture
        var diagonals = [
            board.moveDirectionDelta.north_east,
            board.moveDirectionDelta.north_west
        ];
        if (diagonals.indexOf(Math.abs(start - end)) != -1) {
            if (moving_piece_abbr == 'P') {
                board.removeCaptured(end + board.moveDirectionDelta.south);
            }
            if (moving_piece_abbr == 'p') {
                board.removeCaptured(end + board.moveDirectionDelta.north);
            }
        }
    }
};


/**
 * If a pawn reaches its last rank it is automatically promoted to Queen.
 *
 * TODO: handle user choice.
 *
 * @param {string} piece_abbr A piece in algebraic representation.
 * @return {string} Queen or original piece.
 */
board.handlePawnPromotion = function(piece_abbr, end) {
    if (piece_abbr == 'P' && board.getRank(end) == 7) {
        return 'Q';
    }
    if (piece_abbr == 'p' && board.getRank(end) == 0) {
        return 'q';
    }
    return piece_abbr;
};


/**
 * Set the en passant square if needed.
 *
 * @param {string} piece_abbr The moving piece in algebraic notation.
 * @param {number} start The starting square number.
 * @param {number} end The ending square number.
 */
board.setEnPassantSquare = function(piece_abbr, start, end) {
    if (Math.abs(start - end) == 0x20) {
        if (piece_abbr == 'P') {
            board.position.enpassant = start + 0x10;
        }
        if (piece_abbr == 'p') {
            board.position.enpassant = start - 0x10;
        }
    }
};


var trait = 0;

var chess = {};

/**
 * A string representing all board columns' names
 * @type {string}
 * @const
 */
chess.COLUMNS_STRING = 'abcdefgh';

/**
 * A string representing all board ranks' names
 * @type {string}
 * @const
 */
chess.RANKS_STRING = '12345678';

/**
 * An object representing all valid moves by piece and starting square
 * @type {Object.<string, Array.<string>>}
 */
chess.valid_moves = {
    pawn: {},
    knight: {},
    bishop: {},
    rook: {},
    queen: {},
    king: {}
};

/**
 * An array of all 64 square names in algebraic notation
 * @type {Array.<string>}
 */
chess.ALL_SQUARES = function() {
    var result = [];
    for (var rank = 1; rank < 9; rank++) {
        for (var column_index in chess.COLUMNS_STRING) {
            result.push(chess.COLUMNS_STRING[column_index] + rank);
        }
    }
    return result;
}();

/**
 * Represents a mapping between squares in algebraic notation and their column,
 * rank indexes
 * @type {Object.<string, Object.<number>>}
 */
chess.ALGEBRAIC_TABLE = function() {
    var result = {};
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            result[chess.COLUMNS_STRING[x] + chess.RANKS_STRING[y]] =
                {column: x, rank: y};
        }
    }
    return result;
}();

/**
 * Fills up 'chess.valid_moves' table
 */
chess.initValidMoves = function() {
    var pieces = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
    var valid_piece_moves_function = {
        pawn: validPawnMoves,
        knight: validKnightMoves,
        bishop: validBishopMoves,
        rook: validRookMoves,
        queen: validQueenMoves,
        king: validKingMoves
    };
    for (var square_index in chess.ALL_SQUARES) {
        for (var piece_index in pieces) {
            var piece = pieces[piece_index];
            var square = chess.ALL_SQUARES[square_index];
            chess.valid_moves[piece][square] =
                valid_piece_moves_function[piece](square);
        }
    }

    function validPawnMoves(algebraic_square) {
        // one or two squares ahead
        // capturing?
        var pawn_moves_diff = [[0, 1], [0, 2], [-1, 1], [1, 1]];
        return valid_moves_by_diff(algebraic_square, pawn_moves_diff);
    }

    function validKnightMoves(algebraic_square) {
        var knight_moves_diff = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        return valid_moves_by_diff(algebraic_square, knight_moves_diff);
    }

    function validBishopMoves(algebraic_square) {
        var bishop_moves_diff = [
            [-1, -1], [-2, -2], [-3, -3],
                [-4, -4], [-5, -5], [-6, -6], [-7, -7],
            [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7],
            [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7],
            [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]
        ];
        return valid_moves_by_diff(algebraic_square, bishop_moves_diff);
    }

    function validRookMoves(square) {
        var valid_squares = chess.ALL_SQUARES.filter(function(x) {
            return (
                    (x[0] == square[0] || x[1] == square[1]) &&
                    !(x[0] == square[0] && x[1] == square[1]));
        });
        return valid_squares;
    }

    function validQueenMoves(algebraic_square) {
        var rook_moves = validRookMoves(algebraic_square);
        var bishop_moves = validBishopMoves(algebraic_square);
        return rook_moves.concat(bishop_moves);
    }

    function validKingMoves(algebraic_square) {
        var king_moves_diff = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];
        return valid_moves_by_diff(algebraic_square, king_moves_diff);
    }

    function valid_moves_by_diff(algebraic_square, moves_diff) {
        var start_square = chess.ALGEBRAIC_TABLE[algebraic_square];
        var result = [];
        for (var index in moves_diff) {
            var x_diff = moves_diff[index][0];
            var y_diff = moves_diff[index][1];
            var destination_square = {
                column: start_square.column + x_diff,
                rank: start_square.rank + y_diff
            };
            if ((0 <= destination_square.column < 8) &&
                    (0 <= destination_square.rank < 8)) {
                var column = chess.COLUMNS_STRING[destination_square.column];
                var rank = chess.RANKS_STRING[destination_square.rank];
                if (column != undefined && rank != undefined) {
                    result.push(column + rank);
                }
            }
        }
        return result;
    }
};

/**
 * Given a piece name and a starting square return all valid destination
 * squares
 * @param {string} piece A string defining a chess piece.
 * @param {string} start_square A string representing a square in algebraic
 * notation.
 * @return {Array.<string>} All valid destination squares in algebraic notation.
 */
chess.getValidSquares = function(piece, start_square) {
    var result = chess.valid_moves[piece][start_square];
    return result;
};

function hasTrait(color_number) {
    return trait == color_number;
}

function isUnderCheck() {
}

function isDraw() {
}

function isOccupiedBySameColor(square) {
}

function hasPieceBetweenStartEnd(start_square, end_square) {
}

function hasMoved(piece) {
}

function enPassant() {
}

function canBePromoted(pawn) {
}

function canCastle() {
}

function clearBoard() {
    var pieces = document.querySelectorAll('.piece');
    [].forEach.call(pieces, function(piece) {
        piece.parentNode.removeChild(piece);
    });
}

function loadFen(fen_string) {
    var fen_string = fen_string || document.getElementById('fen_string').value;
    if (validateFen(fen_string)) {
        displayGameInfos(fen_string);
        setupBoardPosition(fen_string);
        document.getElementById('fen_string').value = '';
    }
    return false;
}

function toggleActiveColor() {
    var active_color =
        document.getElementById('active_color').getAttribute('class');
    var next_active_color = 'w';
    if (active_color.indexOf('w') != -1) {
        next_active_color = 'b';
    }
    document.getElementById('active_color').setAttribute('class',
            next_active_color + '_turn');
}

function displayGameInfos(fen_string) {
    var fen = fen_string.split(/\s+/);
    document.getElementById('active_color').setAttribute('class',
            fen[1] + '_turn');
    document.getElementById('castling').textContent = fen[2];
}

function setupBoardPosition(fen_string) {
    clearBoard();
    var fen = fen_string.split(/\s+/);
    var pieces_position = fen[0];
    var ranks = pieces_position.split('/');
    for (var rank_index = 0; rank_index < ranks.length; rank_index++) {
        var rank = ranks[rank_index];
        var number = 0;
            for (var i = 0; i < rank.length; i++) {
                if (isNaN(rank[i])) {
                    placePiece(rank[i], rank_index, number);
                    number += 1;
                } else {
                    number += parseInt(rank[i], 10);
                }
            }
    }
    var pieces = document.querySelectorAll('.piece');
    dnd.setupDnDPieces(pieces);
}

function placePiece(piece, inverted_rank, column) {
    var column_table = {
        0: 'a', 1: 'b', 2: 'c', 3: 'd',
        4: 'e', 5: 'f', 6: 'g', 7: 'h'
    };
    var rank_table = {0: 8, 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1};
    var piece_table = {
        'P': 'piece white_pawn', 'R': 'piece white_rook',
        'N': 'piece white_knight', 'B': 'piece white_bishop',
        'Q': 'piece white_queen', 'K': 'piece white_king',
        'p': 'piece black_pawn', 'r': 'piece black_rook',
        'n': 'piece black_knight', 'b': 'piece black_bishop',
        'q': 'piece black_queen', 'k': 'piece black_king'
    };
    var piece_column = column_table[column];
    var piece_rank = rank_table[inverted_rank];
    var piece_class = piece_table[piece];

    var piece_div = document.createElement('div');
    piece_div.setAttribute('class', 'piece ' + piece_class);
    piece_div.setAttribute('draggable', 'true');
    [].forEach.call(dnd.squares, function(square) {
        var square_rank = square.getAttribute('rank');
        var square_column = square.getAttribute('column');
        if ((parseInt(square_rank, 10) == piece_rank) &&
            (square_column == piece_column)) {
            square.appendChild(piece_div);
        }
    });
}

function validateFen(fen_string) {
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
                    sum_fields += parseInt(ranks[i][k], 10);
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
            return false;
        } else {
            return true;
        }
    }

    var fen = fen_string.split(/\s+/);
    if (fen.length != 6) {
        alert('FEN is more than 6 fields');
        return false;
    }

    var pieces_position = fen[0];
    if (!validatePiecesPosition(pieces_position)) {
        alert('FEN has wrong piece positions');
        return false;
    }

    var active_color = fen[1];
    if (!validateActiveColor(active_color)) {
        alert('FEN has wrong active color field');
        return false;
    }

    var castling = fen[2];
    if (!validateCastling(castling)) {
        alert('FEN has wrong castling field');
        return false;
    }
    var enpassant = fen[3];
    if (!validateEnPassant(enpassant)) {
        alert('FEN has wrong enpassant field');
        return false;
    }

    var halfmove_clock = fen[4];
    if (!validateHalfmoveClock(halfmove_clock)) {
        alert('FEN has wrong halfmove clock field');
        return false;
    }

    var fullmove_number = fen[5];
    if (!validateFullmoveNumber(fullmove_number)) {
        alert('FEN has wrong fullmove field');
        return false;
    }
    return true;
}


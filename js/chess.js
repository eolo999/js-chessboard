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
    var active_color = document.getElementById('active_color').getAttribute('class');
    var next_active_color = 'w';
    if (active_color.indexOf('w') != -1) {
        next_active_color = 'b';
    }
    document.getElementById('active_color').setAttribute('class', next_active_color + '_turn');
}

function displayGameInfos(fen_string) {
    var fen = fen_string.split(/\s+/);
    document.getElementById('active_color').setAttribute('class', fen[1] + '_turn');
    document.getElementById('castling').textContent = fen[2];
}

function setupBoardPosition(fen_string) {
    clearBoard();
    var fen = fen_string.split(/\s+/);
    var pieces_position = fen[0];
    var ranks = pieces_position.split('/');
    for (rank_index = 0; rank_index < ranks.length; rank_index++) {
        var rank = ranks[rank_index];
        var number = 0
            for (i = 0; i < rank.length; i++) {
                if (isNaN(rank[i])) {
                    placePiece(rank[i], rank_index, number);
                    number += 1
                } else {
                    number += parseInt(rank[i]);
                }
            }
    }
    var pieces = document.querySelectorAll('.piece');
    setupDnDPieces(pieces);
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
    [].forEach.call(squares, function(square) {
        var square_rank = square.getAttribute('rank');
        var square_column = square.getAttribute('column');
        if ((parseInt(square_rank) == piece_rank) && (square_column == piece_column)) {
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
}


var _128 = new Object();
var board = new Object();
var ui = new Object();

/** Creates an array of 128 zeroes.
 * @return {Array.<number>} An array of 128 zeroes.
 */
_128.initZerosArray = function() {
    var result = [];
    for (var i = 0; i < 0x80; i++) {
        result.push(0);
    }
    return result;
};


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
board.pieces = _128.initZerosArray();

/** Empties the board from every piece.
 * @type {function()}
 */
board.resetPieces = function() {
    board.pieces = _128.initZerosArray();
};

/**
 * Checks wether a square is on the left side of the 0x88 board (the valid
 * side).
 * @type {function(number)}
 */
board.on_board = function(square) {
    return (square & 0x88) == 0;
}

/**
 * Place the pieces on the board according to a FEN string if given otherwise
 * place pieces in default starting position.
 * @param {string=} fen_string A game position in Forsyth–Edwards Notation
 * (optional).
 */
board.setupFromFen = function(fen_string) {
    if (fen_string == undefined) {
        fen_string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
    var rows = fen_string.split(' ')[0]. split('/').reverse();
    for (var row_index = 0; row_index < 8; row_index++) {
        var square = row_index * 0x10;
        for (var index = 0;
                index < rows[row_index].length; index++) {
            var letter = rows[row_index][index];
            if (isNaN(letter)) {
                board.pieces[square] = letter;
                square += 1;
            } else {
                square += parseInt(letter, 10);
            }
        }
    }
};

board.diagonalsPassingFor = function (square) {

    // body...
}

/**
 * Creates the HTML elements to show the board and attach them to the #board
 * element in the document.
 * @type {function()}
 */
ui.drawBoard = function() {
    var square_counter = 0;
    var table = document.createElement('table');
    table.setAttribute('class', 'board');
    var tr = null;
    var old_tr = null;
    for (var square = 0; square < 0x80; square++) {
        if (board.on_board(square)) {
            if (square_counter % 8 == 0) {
                if (tr) {
                    table.insertBefore(tr, old_tr);
                    old_tr = tr;
                }
                var tr = document.createElement('tr');
            }
            var color = board.COLORS[square];
            var td = document.createElement('td');
            td.setAttribute('id', square);
            td.setAttribute('class', 'square ' + board.COLOR[color]);
            tr.appendChild(td);
            square_counter += 1;
        }
    }
    table.insertBefore(tr, old_tr);
    var board_div = document.getElementById('board');
    board_div.appendChild(table);
};

/**
 * Remove all pieces' HTML nodes from square elements.
 * @type {function()}
 */
ui.resetPieces = function() {
    for (var square = 0; square < 0x80; square++) {
        if (board.on_board(square)) {
            var square_node = document.getElementById(square + '');
            square_node.innerHTML = '';
        }
    }
};

/**
 * Creates the pieces' HTML elements according to board.pieces and append them
 * to the proper square element.
 * @type {function()}
 */
ui.drawPieces = function() {
    for (var square = 0; square < 0x80; square++) {
        if (board.on_board(square)) {
            console.log(square);
            var piece = board.pieces[square];
            console.log('Piece', piece);
            if (piece != 0) {
                var square_node = document.getElementById(square + '');
                var div = document.createElement('div');
                div.setAttribute('class', 'piece ' + piece);
                square_node.appendChild(div);
            }
        }
    }
};

/**
 * Redraws the board from the FEN string found in the #fen_string element.
 * @type {function()}
 */
ui.loadFen = function() {
    var fen_string = document.getElementById('fen_string').value;
    board.resetPieces();
    ui.resetPieces();
    board.setupFromFen(fen_string);
    ui.drawPieces();
};



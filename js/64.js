var _64 = new Object();
var board = new Object();
var ui = new Object();

/** Creates an array of 64 zeroes.
 * @return {Array.<number>} An array of 64 zeroes.
 */
_64.initZerosArray = function() {
    var result = [];
    for (var i = 0; i < 64; i++) {
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
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0];


/**
 * Represents pieces positions on the board.
 * @type {Array.<(number|string)>}
 */
board.pieces = _64.initZerosArray();

/** Empties the board from every piece.
 * @type {function()}
 */
board.resetPieces = function() {
    board.pieces = _64.initZerosArray();
};

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
    var rows = fen_string.split(' ')[0]. split('/');
    var square = 0;
    for (var row_index = 0; row_index < 8; row_index++) {
        for (var square_index = 0;
                square_index < rows[row_index].length; square_index++) {
            var letter = rows[row_index][square_index];
            if (isNaN(letter)) {
                board.pieces[square] = letter;
                square += 1;
            } else {
                square += parseInt(letter, 10);
            }
        }
    }
};


/**
 * Creates the HTML elements to show the board and attach them to the #board
 * element in the document.
 * @type {function()}
 */
ui.drawBoard = function() {
    var board_html = '<table class="board">';
    for (var square = 0; square < 64; square++) {
        if (square % 8 == 0) {
            board_html += '<tr>';
        }
        var color = board.COLORS[square];
        board_html += '<td id="' + square + '" class="square ' +
            board.COLOR[color] + '"></td>';
        if (square % 8 == 7) {
            board_html += '</tr>';
        }
    }
    board_html += '</table>';
    var board_div = document.getElementById('board');
    board_div.innerHTML = board_html;
};

/**
 * Remove all pieces' HTML nodes from square elements.
 * @type {function()}
 */
ui.resetPieces = function() {
    for (var square = 0; square < 64; square++) {
        var square_node = document.getElementById(square + '');
        square_node.innerHTML = '';
    }
};

/**
 * Creates the pieces' HTML elements according to board.pieces and append them
 * to the proper square element.
 * @type {function()}
 */
ui.drawPieces = function() {
    for (var square = 0; square < 64; square++) {
        var piece = board.pieces[square];
        if (piece != 0) {
            var square_node = document.getElementById(square + '');
            var div = document.createElement('div');
            div.setAttribute('class', 'piece ' + piece);
            square_node.appendChild(div);
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



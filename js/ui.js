var ui = new Object();
ui.dnd = new Object();

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
        if (board.onBoard(square)) {
            if (square_counter % 8 == 0) {
                if (tr) {
                    table.insertBefore(tr, old_tr);
                    old_tr = tr;
                }
                tr = document.createElement('tr');
            }
            var color = board.COLORS[square];
            var td = document.createElement('td');
            td.setAttribute('id', 'square_' + square);
            td.setAttribute('class', 'droppable square ' + board.COLOR[color]);
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
        if (board.onBoard(square)) {
            var square_node = document.getElementById('square_' + square);
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
        if (board.onBoard(square)) {
            var piece = board.position.pieces[square];
            if (piece != 0) {
                var square_node = document.getElementById('square_' + square);
                var div = document.createElement('div');
                div.setAttribute('class', 'draggable piece ' + piece);
                square_node.appendChild(div);
            }
        }
    }
};

ui.drawCheck = function() {
    var trait = board.position.trait;
    if (board.isUnderCheck(trait)) {
    $('#under_check').attr('class', 'check');
    } else {
    $('#under_check').attr('class', '');
    }
};

ui.drawTrait = function() {
    var trait = board.position.trait;
    $('#trait').attr('class', trait);
    if (trait == 'w') {
        $('#trait').css('margin-top', '342px')
    } else {
        $('#trait').css('margin-top', '22px')
    }
};


ui.drawCastling = function() {
    var castling = board.position.castling.w.toUpperCase() + board.position.castling.b;
    $('#castling').text(castling);
};

ui.drawEnPassant = function() {
    if (board.position.enpassant == '-') {
        $('#en_passant').text('-');
    } else {
        $('#en_passant').text(board.numberToAlgebraic(board.position.enpassant));
    }
};


/**
 * Redraws the Pieces on the board.
 */
ui.redrawPosition = function() {
    ui.resetPieces();
    ui.drawPieces();
    ui.drawTrait();
    ui.drawCheck();
    ui.drawCastling();
    ui.drawEnPassant();
    ui.dnd.setup();
};


/**
 * Redraws the board from the FEN string found in the #fen_string element.
 * @type {function()}
 */
ui.loadFen = function() {
    var fen_string = document.getElementById('fen_string').value;
    board.setupFromFen(fen_string);
    ui.redrawPosition();
};


ui.dnd.setup = function() {
    $('.draggable').draggable({
        containment: $('.board'),
        helper: 'original',
        opacity: 0.80,
        snap: '.square',
        snapTolerance: 5
        }
    );
    $('.droppable').droppable({
        drop: ui.dnd.dropOnSquareHandler
        }
    );
};


ui.dnd.getSquare = function(node) {
    var square_id = $(node).attr('id');
    return square_id.substr(7);
};

ui.dnd.validMove = function(piece, destination) {
    var source_square = ui.dnd.getSquare(piece.parent());
    var end_square = parseInt(ui.dnd.getSquare(destination));
    return board.makeMove(source_square, end_square);
};

/**
 * Handle piece drop on an empty square. Check if the move is pseudo valid and
 * revert if not.
 *
 * Note: The implementation is rather tricky because I couldn't make the
 * 'revert' callback on the draggable element work properly. I have to flush
 * positioning info from inline css when a valid drop occurs and reset position
 * attributes in the draggable object to revert on invalid drops.
 */
ui.dnd.dropOnSquareHandler = function(event, ui_element) {
    var piece = ui_element.draggable;
    var destination_square = event.target;
    if (ui.dnd.validMove(piece, event.target)) {
        ui.redrawPosition();
        return true;
    } else {
        ui_element.position.top = 0;
        ui_element.position.left = 0;
        $(piece).animate(ui_element.position, 200);
        return false;
    }
};


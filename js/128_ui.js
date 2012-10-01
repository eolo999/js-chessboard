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
        if (board.on_board(square)) {
            if (square_counter % 8 == 0) {
                if (tr) {
                    table.insertBefore(tr, old_tr);
                    old_tr = tr;
                }
                tr = document.createElement('tr');
            }
            var color = board.COLORS[square];
            var td = document.createElement('td');
            td.setAttribute('id', square);
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
            var piece = board.position.pieces[square];
            if (piece != 0) {
                var square_node = document.getElementById(square + '');
                var div = document.createElement('div');
                div.setAttribute('class', 'draggable piece ' + piece);
                square_node.appendChild(div);
            }
        }
    }
};


ui.drawTrait = function () {
    var trait = board.position.trait;
    $('#active_color').attr('class', trait + '_turn');
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
    ui.drawTrait();
};


ui.dnd.getSquare = function(node) {
    return $(node).attr('id');
};

ui.dnd.validMove = function(piece, destination) {
    var source_square = ui.dnd.getSquare(piece.parent());
    var end_square = parseInt(ui.dnd.getSquare(destination));
    return board.makeMove(source_square, end_square);
}

ui.dnd.dragStartHandler = function(event, draggable_ui) {
    var node = event.originalEvent.target;
    var square_node = node.parentNode;
    var start = ui.dnd.getSquare(square_node);
    ui.dnd.dragged = {
        node: node,
        square_node: square_node,
        piece: piece,
        start: start,
    };
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
        $(destination_square).empty();
        $(piece).attr('style', 'position: relative;');
        $(piece).appendTo(destination_square);
        ui.drawTrait();
        return true;
    } else {
        ui_element.position.top = 0;
        ui_element.position.left = 0;
        $(piece).animate(ui_element.position, 200);
        return false;
    }
};


var ui = {
    position: null,

    init: function() {
        var fen_string = document.getElementById('fen_string').value;
        this.position = Object.create(boardPosition);
        this.position.setupFromFen(fen_string);
    },

    /**
     * Creates the HTML elements to show the board and attach them to the #board
     * element in the document.
     * @type {function()}
     */
    drawBoard: function() {
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
    },

    /**
     * Remove all pieces' HTML nodes from square elements.
     * @type {function()}
     */
    resetPieces: function() {
        for (var square = 0; square < 0x80; square++) {
            if (board.onBoard(square)) {
                var square_node = document.getElementById('square_' + square);
                square_node.innerHTML = '';
            }
        }
    },

    /**
     * Creates the pieces' HTML elements according to board.pieces and append them
     * to the proper square element.
     * @type {function()}
     */
    drawPieces: function() {
        for (var square = 0; square < 0x80; square++) {
            if (board.onBoard(square)) {
                var piece = this.position.pieces[square];
                if (piece != 0) {
                    var square_node = document.getElementById('square_' + square);
                    var div = document.createElement('div');
                    div.setAttribute('class', 'draggable piece ' + piece);
                    square_node.appendChild(div);
                }
            }
        }
    },

    drawCheck: function() {
        var trait = this.position.trait,
            king_position = this.position.getKingPosition(trait);
        if (this.position.isUnderCheck(king_position)) {
        $('#under_check').attr('class', 'check');
        } else {
        $('#under_check').attr('class', '');
        }
    },

    drawTrait: function() {
        var trait = this.position.trait;
        $('#trait').attr('class', trait);
        if (trait == 'w') {
            $('#trait').css('margin-top', '342px')
        } else {
            $('#trait').css('margin-top', '20px')
        }
    },


    drawCastling: function() {
        var castling = this.position.castling.w.toUpperCase() + this.position.castling.b;
        $('#castling').text(castling);
    },

    drawFullMove: function() {
        var fullmove = this.position.fullmove;
        $('#fullmove').text(fullmove);
    },

    drawEnPassant: function() {
        if (this.position.enpassant == '-') {
            $('#en_passant').text('-');
        } else {
            $('#en_passant').text(board.numberToAlgebraic(this.position.enpassant));
        }
    },


    /**
     * Redraws the Pieces on the board.
     */
    redrawPosition: function() {
        this.resetPieces();
        this.drawPieces();
        this.drawFullMove();
        this.drawTrait();
        this.drawCheck();
        this.drawCastling();
        this.drawEnPassant();
        dnd.setupDragAndDrop(this);
    },

    getSquare: function(node) {
        var square_id = $(node).attr('id');
        return square_id.substr(7);
    }
};

var dnd = {
    setupDragAndDrop: function(chessboard) {
        $('.draggable').draggable({
            containment: $('.board'),
            helper: 'original',
            opacity: 0.80,
            snap: '.square',
            snapTolerance: 5
            }
        );
        $('.droppable').droppable({
            drop: function (event, ui_element) {
                dnd.dropOnSquareHandler(event, ui_element, chessboard);
            }
        });
    },


    validMove: function(piece, destination, chessboard) {
        var source_square = chessboard.getSquare(piece.parent());
        var end_square = parseInt(chessboard.getSquare(destination));
        return chessboard.position.makeMove(source_square, end_square);
    },

    /**
     * Handle piece drop on an empty square. Check if the move is pseudo valid and
     * revert if not.
     *
     * Note: The implementation is rather tricky because I couldn't make the
     * 'revert' callback on the draggable element work properly. I have to flush
     * positioning info from inline css when a valid drop occurs and reset position
     * attributes in the draggable object to revert on invalid drops.
     */
    dropOnSquareHandler: function(event, ui_element, chessboard) {
        var piece = ui_element.draggable;
        var destination_square = event.target;
        if (dnd.validMove(piece, event.target, chessboard)) {
            chessboard.redrawPosition();
            return true;
        } else {
            ui_element.position.top = 0;
            ui_element.position.left = 0;
            $(piece).animate(ui_element.position, 200);
            return false;
        }
    }
};

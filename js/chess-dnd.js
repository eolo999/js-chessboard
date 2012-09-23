var dnd = {};
dnd.dragged = {};
dnd.dropped = null;
dnd.debugging_object = null;
dnd.squares = null;

dnd.dragStartHandler = function(event) {
    var node = event.target;
    var square_node = node.parentNode;
    var piece = dnd.getPiece(event.target);
    var algebric_start_square = dnd.getSquare(square_node);
    var valid_end_squares = chess.getValidSquares(piece[1], algebric_start_square);
    dnd.dragged = {
        node: node,
        square_node: square_node,
        piece: piece,
        algebric_start_square: algebric_start_square,
        valid_end_squares: valid_end_squares
    };

    event.dataTransfer.effectAllowed = 'move';
    var dragIcon = document.createElement('img');
    dragIcon.src = dnd.getDragIcon(dnd.dragged.node);
    dragIcon.width = 100;
    event.dataTransfer.setDragImage(dragIcon, 22, 22);
    //event.dataTransfer.setData('text/html', this);
    return false;
}

dnd.dragEnterHandler = function(event) {
    var current_square = event.target;
    if (!current_square.hasAttribute('column')) {
        current_square = current_square.parentNode;
    }
    if (dnd.dragged.valid_end_squares.indexOf(dnd.getSquare(current_square)) == -1) {
        current_square.setAttribute('move', 'invalid');
    } else {
        current_square.setAttribute('move', 'valid');
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
}

dnd.dragOverHandler = function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
}

dnd.dragLeaveHandler = function(event) {
    var current_square = event.target;
    if (!current_square.hasAttribute('column')) {
        current_square = current_square.parentNode;
    }
    current_square.removeAttribute('move');
    event.preventDefault();
    return false;
}

dnd.handleDragEnd = function(event) {
    event.preventDefault();
    return false;
}

dnd.dropOnPieceHandler = function(event) {
    dnd.dropped = event.target;
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    var squareNode = dnd.dropped.parentNode;
    var algebric_end_square = dnd.getSquare(squareNode);
    var captured_piece = dnd.getPiece(dnd.dropped);
    //check for different pieces' color and valid move
    if ((dnd.dragged[0] != captured_piece[0]) &&
            (dnd.dragged.valid_end_squares.indexOf(algebric_end_square) != -1)) {
        squareNode.removeChild(dnd.dropped);
        squareNode.appendChild(dnd.dragged.node);
        toggleActiveColor();
        return false;
    }
}

dnd.dropOnSquareHandler = function(event) {
    event.target.removeAttribute('move');
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    var end_square = dnd.getSquare(event.target);
    if (dnd.dragged.valid_end_squares.indexOf(end_square) != -1) {
        event.target.appendChild(dnd.dragged.node);
        toggleActiveColor();
        return false;
    }
}

dnd.getSquare = function(element) {
    return element.getAttribute('column') + element.getAttribute('rank');
}

dnd.getPiece = function(element) {
    var piece_class = element.getAttribute('class');
    piece_class = piece_class.split(' ').pop('piece');
    return piece_class.split('_');
};

dnd.setupDnDPieces = function(pieces) {
    [].forEach.call(pieces, function(piece) {
        piece.addEventListener('dragstart', dnd.dragStartHandler, false);
        piece.addEventListener('dragenter', dnd.dragEnterHandler, false);
        piece.addEventListener('dragover', dnd.dragOverHandler, false);
        piece.addEventListener('dragleave', dnd.dragLeaveHandler, false);
        piece.addEventListener('drop', dnd.dropOnPieceHandler, false);
    });
}

dnd.setupDndSquares = function(squares) {
    [].forEach.call(squares, function(square) {
        square.addEventListener('dragenter', dnd.dragEnterHandler, false);
        square.addEventListener('dragover', dnd.dragOverHandler, false);
        square.addEventListener('dragleave', dnd.dragLeaveHandler, false);
        square.addEventListener('drop', dnd.dropOnSquareHandler, false);
    });
}

dnd.getDragIcon = function(element) {
    var css = document.defaultView.getComputedStyle(element);
    var background_image = css.backgroundImage;
    var start = background_image.indexOf('(') + 1;
    var end = background_image.indexOf(')') - start;
    return background_image.substr(start, end);
}


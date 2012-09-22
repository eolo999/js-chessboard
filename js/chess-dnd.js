var dnd = {};
dnd.dragged = null;
dnd.dropped = null;
dnd.debugging_object = null;
dnd.squares = null;

dnd.dragStartHandler = function(event) {
    dnd.dragged = event.target;
    event.dataTransfer.effectAllowed = 'move';
    var dragIcon = document.createElement('img');
    dragIcon.src = dnd.getDragIcon(dnd.dragged);
    dragIcon.width = 100;
    event.dataTransfer.setDragImage(dragIcon, 22, 22);
    //event.dataTransfer.setData('text/html', this);
    return false;
}

dnd.dragEnterHandler = function(event) {
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
    var parentNode = dnd.dropped.parentNode;
    dnd.dropped.parentNode.removeChild(this);
    parentNode.appendChild(dnd.dragged);
    toggleActiveColor();
    return false;
}

dnd.dropOnSquareHandler = function(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    event.target.appendChild(dnd.dragged);
    toggleActiveColor();
    return false;
}

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


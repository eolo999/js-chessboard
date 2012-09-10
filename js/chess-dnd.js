var dragged = null;
var dropped = null;
var debugging_object = null;

var squares = null;

function dragStartHandler(event) {
    dragged = this;
    event.dataTransfer.effectAllowed = 'move';
    var dragIcon = document.createElement('img');
    dragIcon.src = getDragIcon(this);
    dragIcon.width = 100;
    event.dataTransfer.setDragImage(dragIcon, 22, 22);
    //event.dataTransfer.setData('text/html', this);
    return false;
}

function dragEnterHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
}

function dragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
}

function dragLeaveHandler(event) {
    event.preventDefault();
    return false;
}

function handleDragEnd(event) {
    event.preventDefault();
    return false;
}

function dropOnPieceHandler(event) {
    dropped = this;
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    var parentNode = this.parentNode;
    this.parentNode.removeChild(this);
    parentNode.appendChild(dragged);
    toggleActiveColor();
    return false;
}

function dropOnSquareHandler(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    this.appendChild(dragged);
    toggleActiveColor();
    return false;
}

function setupDnDPieces(pieces) {
    [].forEach.call(pieces, function(piece) {
        piece.setAttribute('draggable', 'true');
        piece.addEventListener('dragstart', dragStartHandler, false);
        piece.addEventListener('dragenter', dragEnterHandler, false);
        piece.addEventListener('dragover', dragOverHandler, false);
        piece.addEventListener('dragleave', dragLeaveHandler, false);
        piece.addEventListener('drop', dropOnPieceHandler, false);
    });
}

function setupDndSquares(squares) {
    [].forEach.call(squares, function(square) {
        square.addEventListener('dragenter', dragEnterHandler, false);
        square.addEventListener('dragover', dragOverHandler, false);
        square.addEventListener('dragleave', dragLeaveHandler, false);
        square.addEventListener('drop', dropOnSquareHandler, false);
    });
}

function getDragIcon(element) {
    var css = document.defaultView.getComputedStyle(element);
    var background_image = css.backgroundImage;
    var start = background_image.indexOf('(') + 1;
    var end = background_image.indexOf(')') - start;
    return background_image.substr(start, end);
}


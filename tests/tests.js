module('board', {
    setup: function() {
        board.setupFromFen();
    }
});

test('onBoard', function() {
    equal(board.onBoard(-0x1), false, '-0x1 is not on board');
    equal(board.onBoard(0x0), true, 'a1 is on board');
    equal(board.onBoard(0x7), true, 'h1 is on board');
    equal(board.onBoard(0x8), false, '0x8 is not on board');
    equal(board.onBoard(0x10), true, 'a2 is on board');
    equal(board.onBoard(0x17), true, 'h2 is on board');
    equal(board.onBoard(0x18), false, '0x18 is not on board');
    equal(board.onBoard(0x20), true, 'a3 is on board');
    equal(board.onBoard(0x27), true, 'h3 is on board');
    equal(board.onBoard(0x28), false, '0x28 is not on board');
    equal(board.onBoard(0x30), true, 'a4 is on board');
    equal(board.onBoard(0x37), true, 'h4 is on board');
    equal(board.onBoard(0x38), false, '0x38 is not on board');
    equal(board.onBoard(0x40), true, 'a5 is on board');
    equal(board.onBoard(0x47), true, 'h5 is on board');
    equal(board.onBoard(0x48), false, '0x48 is not on board');
    equal(board.onBoard(0x50), true, 'a6 is on board');
    equal(board.onBoard(0x57), true, 'h6 is on board');
    equal(board.onBoard(0x58), false, '0x58 is not on board');
    equal(board.onBoard(0x60), true, 'a7 is on board');
    equal(board.onBoard(0x67), true, 'h7 is on board');
    equal(board.onBoard(0x68), false, '0x68 is not on board');
    equal(board.onBoard(0x70), true, 'a8 is on board');
    equal(board.onBoard(0x77), true, 'h8 is on board');
    equal(board.onBoard(0x78), false, '0x78 is not on board');
    equal(board.onBoard(0x81), false, '0x81 is not on board');
});

test('getColumn', function() {
    equal(board.getColumn(0x0), 0);
    equal(board.getColumn(0x7), 7);
    equal(board.getColumn(0x10), 0);
    equal(board.getColumn(0x17), 7);
    equal(board.getColumn(0x20), 0);
    equal(board.getColumn(0x27), 7);
    equal(board.getColumn(0x30), 0);
    equal(board.getColumn(0x37), 7);
    equal(board.getColumn(0x40), 0);
    equal(board.getColumn(0x47), 7);
    equal(board.getColumn(0x50), 0);
    equal(board.getColumn(0x57), 7);
    equal(board.getColumn(0x60), 0);
    equal(board.getColumn(0x67), 7);
    equal(board.getColumn(0x70), 0);
    equal(board.getColumn(0x77), 7);
});

test('getRank', function() {
    equal(board.getRank(0x0), 0);
    equal(board.getRank(0x7), 0);
    equal(board.getRank(0x10), 1);
    equal(board.getRank(0x17), 1);
    equal(board.getRank(0x20), 2);
    equal(board.getRank(0x27), 2);
    equal(board.getRank(0x30), 3);
    equal(board.getRank(0x37), 3);
    equal(board.getRank(0x40), 4);
    equal(board.getRank(0x47), 4);
    equal(board.getRank(0x50), 5);
    equal(board.getRank(0x57), 5);
    equal(board.getRank(0x60), 6);
    equal(board.getRank(0x67), 6);
    equal(board.getRank(0x70), 7);
    equal(board.getRank(0x77), 7);
});

test('algebraicToNumber', function() {
    equal(board.algebraicToNumber('a1'), 0);
    equal(board.algebraicToNumber('a8'), 0x70);
    equal(board.algebraicToNumber('e4'), 0x34);
    equal(board.algebraicToNumber('c6'), 0x52);
    equal(board.algebraicToNumber('h1'), 0x7);
    equal(board.algebraicToNumber('h8'), 0x77);
    equal(board.algebraicToNumber('B7'), undefined);
    equal(board.algebraicToNumber('b9'), undefined);
    equal(board.algebraicToNumber('z9'), undefined);
});

test('numberToAlgebraic', function() {
    equal(board.numberToAlgebraic(-0x1), undefined);
    equal(board.numberToAlgebraic(0x0), 'a1');
    equal(board.numberToAlgebraic(0x70), 'a8');
    equal(board.numberToAlgebraic(0x34), 'e4');
    equal(board.numberToAlgebraic(0x52), 'c6');
    equal(board.numberToAlgebraic(0x7), 'h1');
    equal(board.numberToAlgebraic(0x77), 'h8');
    equal(board.numberToAlgebraic(0x78), undefined);
});

test('getPieceColor', function() {
    equal(board.getPieceColor('P'), 'w');
    equal(board.getPieceColor('N'), 'w');
    equal(board.getPieceColor('B'), 'w');
    equal(board.getPieceColor('R'), 'w');
    equal(board.getPieceColor('Q'), 'w');
    equal(board.getPieceColor('K'), 'w');
    equal(board.getPieceColor('p'), 'b');
    equal(board.getPieceColor('n'), 'b');
    equal(board.getPieceColor('b'), 'b');
    equal(board.getPieceColor('r'), 'b');
    equal(board.getPieceColor('q'), 'b');
    equal(board.getPieceColor('k'), 'b');
});

test('toggleTrait', function() {
    equal(board.position.toggleTrait(), 'b');
    equal(board.position.toggleTrait(), 'w');
    equal(board.position.toggleTrait(), 'b');
});

test('removeCaptured', function() {
    equal(board.position.pieces[0], 'R');
    board.removeCaptured(0);
    equal(board.position.pieces[0], 0);
});


module('makeMove', {
    setup: function() {
        board.generateValidMovesTable();
        board.setupFromFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    }
});

test('Start square is empty', function() {
    equal(board.makeMove(0x30, 0x40), false);
});

test('Moving piece has not trait', function() {
    equal(board.makeMove(0x60, 0x40), false);
});

test('Cannot capture same color pieces', function() {
    equal(board.makeMove(0x0, 0x10), false);
});

test('White Cannot move on unreachable square', function() {
    // white pawn
    equal(board.makeMove(0x10, 0x40), false);
    equal(board.makeMove(0x10, 0x21), false);
    equal(board.makeMove(0x10, 0x35), false);
    // white knight
    equal(board.makeMove(0x1, 0x21), false);
    equal(board.makeMove(0x1, 0x31), false);
    equal(board.makeMove(0x1, 0x50), false);
    equal(board.makeMove(0x6, 0x26), false);
    equal(board.makeMove(0x6, 0x24), false);
    equal(board.makeMove(0x6, 0x51), false);
    // white bishop
    equal(board.makeMove(0x2, 0x12), false);
    equal(board.makeMove(0x2, 0x23), false);
    equal(board.makeMove(0x2, 0x44), false);
    equal(board.makeMove(0x5, 0x22), false);
    equal(board.makeMove(0x5, 0x47), false);
    equal(board.makeMove(0x5, 0x25), false);
    // white rook
    equal(board.makeMove(0x0, 0x11), false);
    equal(board.makeMove(0x0, 0x12), false);
    equal(board.makeMove(0x0, 0x24), false);
    equal(board.makeMove(0x7, 0x25), false);
    equal(board.makeMove(0x7, 0x26), false);
    equal(board.makeMove(0x7, 0x43), false);
    // white queen
    equal(board.makeMove(0x3, 0x22), false);
    equal(board.makeMove(0x3, 0x24), false);
    equal(board.makeMove(0x3, 0x40), false);
    equal(board.makeMove(0x3, 0x37), false);
    equal(board.makeMove(0x3, 0x52), false);
    equal(board.makeMove(0x3, 0x54), false);
    // white king
    equal(board.makeMove(0x4, 0x22), false);
    equal(board.makeMove(0x4, 0x24), false);
    equal(board.makeMove(0x4, 0x40), false);
    equal(board.makeMove(0x4, 0x37), false);
    equal(board.makeMove(0x4, 0x52), false);
    equal(board.makeMove(0x4, 0x54), false);
});

test('Black Cannot move on unreachable square', function() {
    board.position.toggleTrait();
    // black pawn
    equal(board.makeMove(0x60, 0x30), false);
    equal(board.makeMove(0x10, 0x51), false);
    equal(board.makeMove(0x10, 0x41), false);
    // black knight
    equal(board.makeMove(0x71, 0x51), false);
    equal(board.makeMove(0x71, 0x41), false);
    equal(board.makeMove(0x71, 0x43), false);
    equal(board.makeMove(0x76, 0x56), false);
    equal(board.makeMove(0x76, 0x44), false);
    equal(board.makeMove(0x76, 0x46), false);
    // black bishop
    equal(board.makeMove(0x72, 0x12), false);
    equal(board.makeMove(0x72, 0x23), false);
    equal(board.makeMove(0x72, 0x44), false);
    equal(board.makeMove(0x75, 0x22), false);
    equal(board.makeMove(0x75, 0x47), false);
    equal(board.makeMove(0x75, 0x25), false);
    // black rook
    equal(board.makeMove(0x70, 0x11), false);
    equal(board.makeMove(0x70, 0x12), false);
    equal(board.makeMove(0x70, 0x24), false);
    equal(board.makeMove(0x77, 0x25), false);
    equal(board.makeMove(0x77, 0x26), false);
    equal(board.makeMove(0x77, 0x43), false);
    equal(board.makeMove(0x77, 0x25), false);
    // black queen
    equal(board.makeMove(0x73, 0x22), false);
    equal(board.makeMove(0x73, 0x24), false);
    equal(board.makeMove(0x73, 0x30), false);
    equal(board.makeMove(0x73, 0x47), false);
    equal(board.makeMove(0x73, 0x52), false);
    equal(board.makeMove(0x73, 0x54), false);
    // black king
    equal(board.makeMove(0x74, 0x22), false);
    equal(board.makeMove(0x74, 0x24), false);
    equal(board.makeMove(0x74, 0x40), false);
    equal(board.makeMove(0x74, 0x37), false);
    equal(board.makeMove(0x74, 0x52), false);
    equal(board.makeMove(0x74, 0x54), false);
});

module('FEN', {
    setup: function() {
        board.setupFromFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    }
});

test('Set en passant square from FEN string', function() {
    ok(board.position.enpassant == 82);
});

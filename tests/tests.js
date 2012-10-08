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


module('King Checks', {
    setup: function() {
        board.generateValidMovesTable();
    }
});

test('Not under check', function() {
    board.setupFromFen('rnbqkbnr/pppp1ppp/8/4p3/3P4/4P3/PPP2PPP/RNBQKBNR w KQkq - 0 1');
    equal(board.isUnderCheck('w'), false);
    board.makeAlgebraicMove('f2', 'f3');
    equal(board.isUnderCheck('w'), false);
    board.makeAlgebraicMove('d6', 'd5');
    equal(board.isUnderCheck('w'), false);
});

test('Under bishop check', function() {
    board.setupFromFen('rnbqkbnr/ppp2ppp/3p4/1B2p3/3P4/4P3/PPP2PPP/RNBQK1NR b KQkq - 0 1');
    equal(board.isUnderCheck('b'), true);
});

test('Under queen check', function() {
    board.setupFromFen('rnb1kbnr/pp2qppp/2pp4/1B6/3P4/8/PPP2PPP/RNBQK1NR w KQkq - 0 1');
    equal(board.isUnderCheck('w'), true);
});

test('Under pawn check', function() {
    board.setupFromFen('4k3/3P4/8/8/8/8/8/7K b - - 0 1');
    equal(board.isUnderCheck('b'), true);
});

module('hasObstacles', {
    setup: function() {
        board.generateValidMovesTable();
        board.setupFromFen('rnbqkbnr/pppp1ppp/8/4p3/3P4/4P3/PPP2PPP/RNBQKBNR w KQkq - 0 1');
    }
});

module('makeMove', {
    setup: function() {
        board.generateValidMovesTable();
        board.setupFromFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    }
});

test('Start square is empty', function() {
    equal(board.makeAlgebraicMove('a4', 'a5'), false);
});

test('Moving piece has not trait', function() {
    equal(board.makeAlgebraicMove('a7', 'a5'), false);
});

test('Cannot capture same color pieces', function() {
    equal(board.makeAlgebraicMove('a1', 'a2'), false);
});

// this test will fail when implementing 'checks'
test('Cannot capture King', function() {
    ok(board.makeAlgebraicMove('e4', 'e5'));
    ok(board.makeAlgebraicMove('d8', 'a5'));
    ok(board.makeAlgebraicMove('d2', 'd3'));
    equal(board.makeAlgebraicMove('a5', 'e1'), false);
});

test('White Cannot move on unreachable empty square', function() {
    // white pawn
    equal(board.makeAlgebraicMove('a2', 'a5'), false);
    equal(board.makeAlgebraicMove('a2', 'b3'), false);
    equal(board.makeAlgebraicMove('a2', 'f4'), false);
    // white knight
    equal(board.makeAlgebraicMove('b1', 'b3'), false);
    equal(board.makeAlgebraicMove('b1', 'b4'), false);
    equal(board.makeAlgebraicMove('b1', 'a6'), false);
    equal(board.makeAlgebraicMove('g1', 'g3'), false);
    equal(board.makeAlgebraicMove('g1', 'e3'), false);
    equal(board.makeAlgebraicMove('g1', 'b6'), false);
    // white bishop
    equal(board.makeAlgebraicMove('c1', 'c2'), false);
    equal(board.makeAlgebraicMove('c1', 'd3'), false);
    equal(board.makeAlgebraicMove('c1', 'e5'), false);
    equal(board.makeAlgebraicMove('f1', 'c3'), false);
    equal(board.makeAlgebraicMove('f1', 'h5'), false);
    equal(board.makeAlgebraicMove('f1', 'f3'), false);
    // white rook
    equal(board.makeAlgebraicMove('a1', 'b2'), false);
    equal(board.makeAlgebraicMove('a1', 'b3'), false);
    equal(board.makeAlgebraicMove('a1', 'c4'), false);
    equal(board.makeAlgebraicMove('h1', 'c5'), false);
    equal(board.makeAlgebraicMove('h1', 'g6'), false);
    equal(board.makeAlgebraicMove('h1', 'f5'), false);
    // white queen
    equal(board.makeAlgebraicMove('d1', 'c3'), false);
    equal(board.makeAlgebraicMove('d1', 'e3'), false);
    equal(board.makeAlgebraicMove('d1', 'a5'), false);
    equal(board.makeAlgebraicMove('d1', 'h4'), false);
    equal(board.makeAlgebraicMove('d1', 'c6'), false);
    equal(board.makeAlgebraicMove('d1', 'g6'), false);
    // white king
    equal(board.makeAlgebraicMove('e1', 'e3'), false);
    equal(board.makeAlgebraicMove('e1', 'd3'), false);
    equal(board.makeAlgebraicMove('e1', 'f3'), false);
    equal(board.makeAlgebraicMove('e1', 'a5'), false);
    equal(board.makeAlgebraicMove('e1', 'b6'), false);
    equal(board.makeAlgebraicMove('e1', 'c4'), false);
});

test('Black Cannot move on unreachable empty square', function() {
    board.position.toggleTrait();
    // black pawn
    equal(board.makeAlgebraicMove('a7', 'a4'), false);
    equal(board.makeAlgebraicMove('a7', 'b6'), false);
    equal(board.makeAlgebraicMove('a7', 'b6'), false);
    // black knight
    equal(board.makeAlgebraicMove('b8', 'b6'), false);
    equal(board.makeAlgebraicMove('b8', 'b5'), false);
    equal(board.makeAlgebraicMove('b8', 'c5'), false);
    equal(board.makeAlgebraicMove('g8', 'g6'), false);
    equal(board.makeAlgebraicMove('g8', 'g5'), false);
    equal(board.makeAlgebraicMove('g8', 'f5'), false);
    // black bishop
    equal(board.makeAlgebraicMove('c8', 'c2'), false);
    equal(board.makeAlgebraicMove('c8', 'd3'), false);
    equal(board.makeAlgebraicMove('c8', 'e5'), false);
    equal(board.makeAlgebraicMove('f8', 'c3'), false);
    equal(board.makeAlgebraicMove('f8', 'h5'), false);
    equal(board.makeAlgebraicMove('f8', 'f3'), false);
    // black rook
    equal(board.makeAlgebraicMove('a8', 'b2'), false);
    equal(board.makeAlgebraicMove('a8', 'c2'), false);
    equal(board.makeAlgebraicMove('a8', 'e3'), false);
    equal(board.makeAlgebraicMove('h8', 'f3'), false);
    equal(board.makeAlgebraicMove('h8', 'g3'), false);
    equal(board.makeAlgebraicMove('h8', 'd5'), false);
    // black queen
    equal(board.makeAlgebraicMove('d8', 'c3'), false);
    equal(board.makeAlgebraicMove('d8', 'e3'), false);
    equal(board.makeAlgebraicMove('d8', 'a4'), false);
    equal(board.makeAlgebraicMove('d8', 'h5'), false);
    equal(board.makeAlgebraicMove('d8', 'c6'), false);
    equal(board.makeAlgebraicMove('d8', 'e6'), false);
    // black king
    equal(board.makeAlgebraicMove('e8', 'c3'), false);
    equal(board.makeAlgebraicMove('e8', 'e3'), false);
    equal(board.makeAlgebraicMove('e8', 'a5'), false);
    equal(board.makeAlgebraicMove('e8', 'h4'), false);
    equal(board.makeAlgebraicMove('e8', 'c6'), false);
    equal(board.makeAlgebraicMove('e8', 'e6'), false);
});

test('Set en passant square and capture', function() {
    ok(board.position.enpassant == 82);
    ok(board.makeAlgebraicMove('d2', 'd4'));
    ok(board.position.enpassant == board.algebraicToNumber('d3'));
    ok(board.makeAlgebraicMove('d7', 'd5'));
    ok(board.position.enpassant == board.algebraicToNumber('d6'));
    ok(board.makeAlgebraicMove('e4', 'e5'));
    ok(board.makeAlgebraicMove('f7', 'f5'));
    ok(board.position.enpassant == board.algebraicToNumber('f6'));
    ok(board.makeAlgebraicMove('e5', 'f6'));
});

test('White Bishop cannot go after obstacles', function() {
    board.setupFromFen('6k1/8/2p1p3/3B4/2P1P3/8/8/6K1 w - - 0 1');
    equal(board.makeAlgebraicMove('d5', 'b7'), false);
    equal(board.makeAlgebraicMove('d5', 'f7'), false);
    equal(board.makeAlgebraicMove('d5', 'b3'), false);
    equal(board.makeAlgebraicMove('d5', 'f3'), false);
});

test('Black Bishop cannot go after obstacles', function() {
    board.setupFromFen('6k1/8/2p1p3/3b4/2P1P3/8/8/6K1 w - - 0 1');
    equal(board.makeAlgebraicMove('d5', 'b7'), false);
    equal(board.makeAlgebraicMove('d5', 'f7'), false);
    equal(board.makeAlgebraicMove('d5', 'b3'), false);
    equal(board.makeAlgebraicMove('d5', 'f3'), false);
});

test('White Rook cannot go after obstacles', function() {
    board.setupFromFen('7k/8/3p4/2PRp3/3P4/8/8/7K w - - 0 1');
    equal(board.makeAlgebraicMove('d5', 'd3'), false);
    equal(board.makeAlgebraicMove('d5', 'd7'), false);
    equal(board.makeAlgebraicMove('d5', 'b5'), false);
    equal(board.makeAlgebraicMove('d5', 'f5'), false);
});

test('Black Rook cannot go after obstacles', function() {
    board.setupFromFen('7k/8/3p4/2Prp3/3P4/8/8/7K w - - 0 1');
    equal(board.makeAlgebraicMove('d5', 'd3'), false);
    equal(board.makeAlgebraicMove('d5', 'd7'), false);
    equal(board.makeAlgebraicMove('d5', 'b5'), false);
    equal(board.makeAlgebraicMove('d5', 'f5'), false);
});

test('White Queen cannot go after obstacles', function() {
    board.setupFromFen('7k/8/2ppp3/2pQP3/2PPP3/8/8/7K w - - 0 1');
    equal(board.makeAlgebraicMove('d5', 'b7'), false);
    equal(board.makeAlgebraicMove('d5', 'f7'), false);
    equal(board.makeAlgebraicMove('d5', 'b3'), false);
    equal(board.makeAlgebraicMove('d5', 'f3'), false);
    equal(board.makeAlgebraicMove('d5', 'd3'), false);
    equal(board.makeAlgebraicMove('d5', 'd7'), false);
    equal(board.makeAlgebraicMove('d5', 'b5'), false);
    equal(board.makeAlgebraicMove('d5', 'f5'), false);
});

test('Black Queen cannot go after obstacles', function() {
    board.setupFromFen('7k/8/2ppp3/2pqP3/2PPP3/8/8/7K w - - 0 1');
    equal(board.makeAlgebraicMove('d5', 'b7'), false);
    equal(board.makeAlgebraicMove('d5', 'f7'), false);
    equal(board.makeAlgebraicMove('d5', 'b3'), false);
    equal(board.makeAlgebraicMove('d5', 'f3'), false);
    equal(board.makeAlgebraicMove('d5', 'd3'), false);
    equal(board.makeAlgebraicMove('d5', 'd7'), false);
    equal(board.makeAlgebraicMove('d5', 'b5'), false);
    equal(board.makeAlgebraicMove('d5', 'f5'), false);
});

module('Castling', {
    setup: function() {
        board.setupFromFen('r3k2r/pbpp1ppp/1pn2q1n/2b1p3/2B1P3/1PN2Q1N/PBPP1PPP/R3K2R w KQkq - 0 1');
    }
});

test('Valid King side castling', function() {
    ok(board.makeAlgebraicMove('e1', 'g1'));
    ok(board.position.pieces[board.algebraicToNumber('g1')] == 'K');
    ok(board.position.pieces[board.algebraicToNumber('f1')] == 'R');
    ok(board.makeAlgebraicMove('e8', 'g8'));
    ok(board.position.pieces[board.algebraicToNumber('g8')] == 'k');
    ok(board.position.pieces[board.algebraicToNumber('f8')] == 'r');
});

test('Invalid King side castling', function() {
    // Move bishops back on their respective 1st rank
    board.makeAlgebraicMove('c4', 'f1');
    board.makeAlgebraicMove('c6', 'f8');
    // White: Castle King side
    equal(board.makeAlgebraicMove('e1', 'g1'), false);
    // Give the trait to black
    board.position.toggleTrait();
    // Black: Castle King side
    equal(board.makeAlgebraicMove('e8', 'g8'), false);
});

test('Valid Queen side castling', function() {
    ok(board.makeAlgebraicMove('e1', 'c1'));
    ok(board.position.pieces[board.algebraicToNumber('c1')] == 'K');
    ok(board.position.pieces[board.algebraicToNumber('d1')] == 'R');
    ok(board.makeAlgebraicMove('e8', 'c8'));
    ok(board.position.pieces[board.algebraicToNumber('c8')] == 'k');
    ok(board.position.pieces[board.algebraicToNumber('d8')] == 'r');
});

test('Invalid Queen side castling', function() {
    // Move queens back on their respective 1st rank
    board.makeAlgebraicMove('f3', 'd1');
    board.makeAlgebraicMove('c6', 'd8');
    // White: Castle King side
    equal(board.makeAlgebraicMove('e1', 'c1'), false);
    // Give the trait to black
    board.position.toggleTrait();
    // Black: Castle King side
    equal(board.makeAlgebraicMove('e8', 'c8'), false);
});

test('Remove all castling capabilities on king\'s move', function() {
    board.makeAlgebraicMove('e1', 'f1');
    equal(board.position.castling.w, '');
    board.makeAlgebraicMove('e8', 'f8');
    equal(board.position.castling.b, '');
});

test('Remove King side castling capability on K-Rook move', function() {
    board.makeAlgebraicMove('h1', 'g1');
    equal(board.position.castling.w, 'q');
    board.makeAlgebraicMove('h8', 'g8');
    equal(board.position.castling.b, 'q');
});

test('Remove Queen side castling capability on Q-Rook move', function() {
    board.makeAlgebraicMove('a1', 'b1');
    equal(board.position.castling.w, 'k');
    board.makeAlgebraicMove('a8', 'b8');
    equal(board.position.castling.b, 'k');
});

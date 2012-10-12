module('board');

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

module('position', {});

test('toggleTrait', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen();
    equal(position.trait, 'w')
    position.toggleTrait();
    equal(position.trait, 'b')
    position.toggleTrait();
    equal(position.trait, 'w')
    position.toggleTrait();
    equal(position.trait, 'b')
});

test('removeCaptured', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen();
    equal(position.pieces[0], 'R');
    position.removeCaptured(0);
    equal(position.pieces[0], 0);
});


module('King Checks', {});

test('Not under check', function() {
    var position = Object.create(boardPosition),
        black_king_position,
        white_king_position;

    position.setupFromFen(
        'rnbqkbnr/pppp1ppp/8/4p3/3P4/4P3/PPP2PPP/RNBQKBNR w KQkq - 0 1');
    white_king_position = position.getKingPosition('w'),
    black_king_position = position.getKingPosition('b');

    equal(position.isUnderCheck(white_king_position), false);
    position.makeAlgebraicMove('f2', 'f3');
    equal(position.isUnderCheck(black_king_position), false);
    position.makeAlgebraicMove('d6', 'd5');
    equal(position.isUnderCheck(white_king_position), false);
});

test('Under bishop check', function() {
    var position = Object.create(boardPosition),
        black_king_position;
    position.setupFromFen(
        'rnbqkbnr/ppp2ppp/3p4/1B2p3/3P4/4P3/PPP2PPP/RNBQK1NR b KQkq - 0 1');
    black_king_position = position.getKingPosition('b');
    equal(position.isUnderCheck(black_king_position), true);
});

test('Under queen check', function() {
    var position = Object.create(boardPosition),
        white_king_position;
    position.setupFromFen(
        'rnb1kbnr/pp2qppp/2pp4/1B6/3P4/8/PPP2PPP/RNBQK1NR w KQkq - 0 1');
    white_king_position = position.getKingPosition('w'),
    equal(position.isUnderCheck(white_king_position), true);
});

// test('Under pawn check', function() {
//     board.setupFromFen('4k3/3P4/8/8/8/8/8/7K b - - 0 1');
//     equal(board.isUnderCheck('b'), true);
// });

module('makeMove', {});

test('Start square is empty', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    equal(position.makeAlgebraicMove('a4', 'a5'), false);
});

test('Moving piece has not trait', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    equal(position.makeAlgebraicMove('a7', 'a5'), false);
});

test('Cannot capture same color pieces', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    equal(position.makeAlgebraicMove('a1', 'a2'), false);
});

test('Cannot put the king under check with a move', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    ok(position.makeAlgebraicMove('e4', 'e5'));
    ok(position.makeAlgebraicMove('d8', 'a5'));
    equal(position.makeAlgebraicMove('d2', 'd3'), false);
});

test('White Cannot move on unreachable empty square', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    // white pawn
    equal(position.makeAlgebraicMove('a2', 'a5'), false);
    equal(position.makeAlgebraicMove('a2', 'b3'), false);
    equal(position.makeAlgebraicMove('a2', 'f4'), false);
    // white knight
    equal(position.makeAlgebraicMove('b1', 'b3'), false);
    equal(position.makeAlgebraicMove('b1', 'b4'), false);
    equal(position.makeAlgebraicMove('b1', 'a6'), false);
    equal(position.makeAlgebraicMove('g1', 'g3'), false);
    equal(position.makeAlgebraicMove('g1', 'e3'), false);
    equal(position.makeAlgebraicMove('g1', 'b6'), false);
    // white bishop
    equal(position.makeAlgebraicMove('c1', 'c2'), false);
    equal(position.makeAlgebraicMove('c1', 'd3'), false);
    equal(position.makeAlgebraicMove('c1', 'e5'), false);
    equal(position.makeAlgebraicMove('f1', 'c3'), false);
    equal(position.makeAlgebraicMove('f1', 'h5'), false);
    equal(position.makeAlgebraicMove('f1', 'f3'), false);
    // white rook
    equal(position.makeAlgebraicMove('a1', 'b2'), false);
    equal(position.makeAlgebraicMove('a1', 'b3'), false);
    equal(position.makeAlgebraicMove('a1', 'c4'), false);
    equal(position.makeAlgebraicMove('h1', 'c5'), false);
    equal(position.makeAlgebraicMove('h1', 'g6'), false);
    equal(position.makeAlgebraicMove('h1', 'f5'), false);
    // white queen
    equal(position.makeAlgebraicMove('d1', 'c3'), false);
    equal(position.makeAlgebraicMove('d1', 'e3'), false);
    equal(position.makeAlgebraicMove('d1', 'a5'), false);
    equal(position.makeAlgebraicMove('d1', 'h4'), false);
    equal(position.makeAlgebraicMove('d1', 'c6'), false);
    equal(position.makeAlgebraicMove('d1', 'g6'), false);
    // white king
    equal(position.makeAlgebraicMove('e1', 'e3'), false);
    equal(position.makeAlgebraicMove('e1', 'd3'), false);
    equal(position.makeAlgebraicMove('e1', 'f3'), false);
    equal(position.makeAlgebraicMove('e1', 'a5'), false);
    equal(position.makeAlgebraicMove('e1', 'b6'), false);
    equal(position.makeAlgebraicMove('e1', 'c4'), false);
});

test('Black Cannot move on unreachable empty square', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    position.toggleTrait();
    // black pawn
    equal(position.makeAlgebraicMove('a7', 'a4'), false);
    equal(position.makeAlgebraicMove('a7', 'b6'), false);
    equal(position.makeAlgebraicMove('a7', 'b6'), false);
    // black knight
    equal(position.makeAlgebraicMove('b8', 'b6'), false);
    equal(position.makeAlgebraicMove('b8', 'b5'), false);
    equal(position.makeAlgebraicMove('b8', 'c5'), false);
    equal(position.makeAlgebraicMove('g8', 'g6'), false);
    equal(position.makeAlgebraicMove('g8', 'g5'), false);
    equal(position.makeAlgebraicMove('g8', 'f5'), false);
    // black bishop
    equal(position.makeAlgebraicMove('c8', 'c2'), false);
    equal(position.makeAlgebraicMove('c8', 'd3'), false);
    equal(position.makeAlgebraicMove('c8', 'e5'), false);
    equal(position.makeAlgebraicMove('f8', 'c3'), false);
    equal(position.makeAlgebraicMove('f8', 'h5'), false);
    equal(position.makeAlgebraicMove('f8', 'f3'), false);
    // black rook
    equal(position.makeAlgebraicMove('a8', 'b2'), false);
    equal(position.makeAlgebraicMove('a8', 'c2'), false);
    equal(position.makeAlgebraicMove('a8', 'e3'), false);
    equal(position.makeAlgebraicMove('h8', 'f3'), false);
    equal(position.makeAlgebraicMove('h8', 'g3'), false);
    equal(position.makeAlgebraicMove('h8', 'd5'), false);
    // black queen
    equal(position.makeAlgebraicMove('d8', 'c3'), false);
    equal(position.makeAlgebraicMove('d8', 'e3'), false);
    equal(position.makeAlgebraicMove('d8', 'a4'), false);
    equal(position.makeAlgebraicMove('d8', 'h5'), false);
    equal(position.makeAlgebraicMove('d8', 'c6'), false);
    equal(position.makeAlgebraicMove('d8', 'e6'), false);
    // black king
    equal(position.makeAlgebraicMove('e8', 'c3'), false);
    equal(position.makeAlgebraicMove('e8', 'e3'), false);
    equal(position.makeAlgebraicMove('e8', 'a5'), false);
    equal(position.makeAlgebraicMove('e8', 'h4'), false);
    equal(position.makeAlgebraicMove('e8', 'c6'), false);
    equal(position.makeAlgebraicMove('e8', 'e6'), false);
});

test('Set en passant square and capture', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
    ok(position.enpassant == 82);
    ok(position.makeAlgebraicMove('d2', 'd4'));
    ok(position.enpassant == board.algebraicToNumber('d3'));
    ok(position.makeAlgebraicMove('d7', 'd5'));
    ok(position.enpassant == board.algebraicToNumber('d6'));
    ok(position.makeAlgebraicMove('e4', 'e5'));
    ok(position.makeAlgebraicMove('f7', 'f5'));
    ok(position.enpassant == board.algebraicToNumber('f6'));
    ok(position.makeAlgebraicMove('e5', 'f6'));
});

test('White Bishop cannot go after obstacles', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        '6k1/8/2p1p3/3B4/2P1P3/8/8/6K1 w - - 0 1');
    equal(position.makeAlgebraicMove('d5', 'b7'), false);
    equal(position.makeAlgebraicMove('d5', 'f7'), false);
    equal(position.makeAlgebraicMove('d5', 'b3'), false);
    equal(position.makeAlgebraicMove('d5', 'f3'), false);
});

test('Black Bishop cannot go after obstacles', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        '6k1/8/2p1p3/3b4/2P1P3/8/8/6K1 b - - 0 1');
    equal(position.makeAlgebraicMove('d5', 'b7'), false);
    equal(position.makeAlgebraicMove('d5', 'f7'), false);
    equal(position.makeAlgebraicMove('d5', 'b3'), false);
    equal(position.makeAlgebraicMove('d5', 'f3'), false);
});

test('White Rook cannot go after obstacles', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        '7k/8/3p4/2PRp3/3P4/8/8/7K w - - 0 1');
    equal(position.makeAlgebraicMove('d5', 'd3'), false);
    equal(position.makeAlgebraicMove('d5', 'd7'), false);
    equal(position.makeAlgebraicMove('d5', 'b5'), false);
    equal(position.makeAlgebraicMove('d5', 'f5'), false);
});

test('Black Rook cannot go after obstacles', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        '7k/8/3p4/2Prp3/3P4/8/8/7K b - - 0 1');
    equal(position.makeAlgebraicMove('d5', 'd3'), false);
    equal(position.makeAlgebraicMove('d5', 'd7'), false);
    equal(position.makeAlgebraicMove('d5', 'b5'), false);
    equal(position.makeAlgebraicMove('d5', 'f5'), false);
});

test('White Queen cannot go after obstacles', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        '7k/8/2ppp3/2pQP3/2PPP3/8/8/7K w - - 0 1');
    equal(position.makeAlgebraicMove('d5', 'b7'), false);
    equal(position.makeAlgebraicMove('d5', 'f7'), false);
    equal(position.makeAlgebraicMove('d5', 'b3'), false);
    equal(position.makeAlgebraicMove('d5', 'f3'), false);
    equal(position.makeAlgebraicMove('d5', 'd3'), false);
    equal(position.makeAlgebraicMove('d5', 'd7'), false);
    equal(position.makeAlgebraicMove('d5', 'b5'), false);
    equal(position.makeAlgebraicMove('d5', 'f5'), false);
});

test('Black Queen cannot go after obstacles', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        '7k/8/2ppp3/2pqP3/2PPP3/8/8/7K b - - 0 1');
    equal(position.makeAlgebraicMove('d5', 'b7'), false);
    equal(position.makeAlgebraicMove('d5', 'f7'), false);
    equal(position.makeAlgebraicMove('d5', 'b3'), false);
    equal(position.makeAlgebraicMove('d5', 'f3'), false);
    equal(position.makeAlgebraicMove('d5', 'd3'), false);
    equal(position.makeAlgebraicMove('d5', 'd7'), false);
    equal(position.makeAlgebraicMove('d5', 'b5'), false);
    equal(position.makeAlgebraicMove('d5', 'f5'), false);
});

module('Castling', {});

test('Valid King side castling', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'r3k2r/pbpp1ppp/1pn2q1n/2b1p3/2B1P3/1PN2Q1N/PBPP1PPP/R3K2R w KQkq - 0 1');
    ok(position.makeAlgebraicMove('e1', 'g1'));
    ok(position.pieces[board.algebraicToNumber('g1')] == 'K');
    ok(position.pieces[board.algebraicToNumber('f1')] == 'R');
    ok(position.makeAlgebraicMove('e8', 'g8'));
    ok(position.pieces[board.algebraicToNumber('g8')] == 'k');
    ok(position.pieces[board.algebraicToNumber('f8')] == 'r');
});

test('Invalid King side castling', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'r3k2r/pbpp1ppp/1pn2q1n/2b1p3/2B1P3/1PN2Q1N/PBPP1PPP/R3K2R w KQkq - 0 1');
    // Move bishops back on their respective 1st rank
    position.makeAlgebraicMove('c4', 'f1');
    position.makeAlgebraicMove('c6', 'f8');
    // White: Castle King side
    equal(position.makeAlgebraicMove('e1', 'g1'), false);
    // Give the trait to black
    position.toggleTrait();
    // Black: Castle King side
    equal(position.makeAlgebraicMove('e8', 'g8'), false);
});

test('Valid Queen side castling', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'r3k2r/pbpp1ppp/1pn2q1n/2b1p3/2B1P3/1PN2Q1N/PBPP1PPP/R3K2R w KQkq - 0 1');
    ok(position.makeAlgebraicMove('e1', 'c1'));
    ok(position.pieces[board.algebraicToNumber('c1')] == 'K');
    ok(position.pieces[board.algebraicToNumber('d1')] == 'R');
    ok(position.makeAlgebraicMove('e8', 'c8'));
    ok(position.pieces[board.algebraicToNumber('c8')] == 'k');
    ok(position.pieces[board.algebraicToNumber('d8')] == 'r');
});

test('Invalid Queen side castling', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'r3k2r/pbpp1ppp/1pn2q1n/2b1p3/2B1P3/1PN2Q1N/PBPP1PPP/R3K2R w KQkq - 0 1');
    // Move queens back on their respective 1st rank
    position.makeAlgebraicMove('f3', 'd1');
    position.makeAlgebraicMove('c6', 'd8');
    // White: Castle King side
    equal(position.makeAlgebraicMove('e1', 'c1'), false);
    // Give the trait to black
    position.toggleTrait();
    // Black: Castle King side
    equal(position.makeAlgebraicMove('e8', 'c8'), false);
});

test('Remove all castling capabilities on king\'s move', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'r3k2r/pbpp1ppp/1pn2q1n/2b1p3/2B1P3/1PN2Q1N/PBPP1PPP/R3K2R w KQkq - 0 1');
    position.makeAlgebraicMove('e1', 'f1');
    equal(position.castling.w, '');
    position.makeAlgebraicMove('e8', 'f8');
    equal(position.castling.b, '');
});

test('Remove King side castling capability on K-Rook move', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'r3k2r/pbpp1ppp/1pn2q1n/2b1p3/2B1P3/1PN2Q1N/PBPP1PPP/R3K2R w KQkq - 0 1');
    position.makeAlgebraicMove('h1', 'g1');
    equal(position.castling.w, 'q');
    position.makeAlgebraicMove('h8', 'g8');
    equal(position.castling.b, 'q');
});

test('Remove Queen side castling capability on Q-Rook move', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'r3k2r/pbpp1ppp/1pn2q1n/2b1p3/2B1P3/1PN2Q1N/PBPP1PPP/R3K2R w KQkq - 0 1');
    position.makeAlgebraicMove('a1', 'b1');
    equal(position.castling.w, 'k');
    position.makeAlgebraicMove('a8', 'b8');
    equal(position.castling.b, 'k');
});

test('Castling squares are under attack', function() {
    var position = Object.create(boardPosition);
    position.setupFromFen(
        'r1bqk2r/p1pp2pp/1pn2p2/4p3/1NB1P3/3PbN2/PPP1QPPP/R3K2R b KQkq - 0 1');
    equal(position.makeAlgebraicMove('e8', 'g8'), false);
    position.toggleTrait();
    equal(position.makeAlgebraicMove('e1', 'c1'), false);
});

var boardPosition = {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    validMovesTable: board.generateValidMovesTable(),
    pieces: board.initZerosArray(),
    trait: 'w',
    castling: {w: 'kq', b: 'kq'},
    halfmove: '0',
    fullmove: '1',

    resetPieces: function() {
        this.pieces = board.initZerosArray();
    },

    toggleTrait: function () {
        if (this.trait == 'w') {
            this.trait = 'b';
        } else {
            this.trait = 'w';
        }
    },

    removeCaptured: function(square) {
        this.pieces[square] = 0;
    },

    setupFromFen: function() {
        this.resetPieces();
        function validateFEN(fen) {
            return true;
        }

        function setupPieces(position, rows_string) {
            var rows = rows_string.split('/').reverse();
            for (var row_index = 0; row_index < 8; row_index++) {
                var square = row_index * 0x10;
                for (var index = 0;
                        index < rows[row_index].length; index++) {
                    var letter = rows[row_index][index];
                    if (isNaN(letter)) {
                        position.pieces[square] = letter;
                        square += 1;
                    } else {
                        square += parseInt(letter, 10);
                    }
                }
            }
        }

        function setupCastling(position, castling_string) {
            var white = '';
            var black = '';
            for (var index = 0; index < castling_string.length; index++) {
                var letter = castling_string[index];
                if (letter == letter.toUpperCase()) {
                    white += letter.toLowerCase();
                } else {
                    black += letter;
                }
            }
            position.castling.w = white;
            position.castling.b = black;
        }

        function setupPosition(position, attribute, value) {
            position[attribute] = value;
        }

        if (validateFEN(this.fen)) {
            var fen_array = this.fen.split(' ');
            var enpassant = fen_array[3];
            if (enpassant != '-') {
                enpassant = board.algebraicToNumber(enpassant);
            }
            setupPieces(this, fen_array[0]);
            setupPosition(this, 'trait', fen_array[1]);
            setupCastling(this, fen_array[2]);
            setupPosition(this, 'enpassant', enpassant);
            setupPosition(this, 'halfmove', fen_array[4]);
            setupPosition(this, 'fullmove', fen_array[5]);
        }
    },

    validPawnMoves: function(color, start) {
        var rank_delta = 0x10;
        var step = [];
        var diagonals = [];
        var moves = [];
        if (color == 'w') {
            diagonals = [
                board.moveDirectionDelta.north_west,
                board.moveDirectionDelta.north_east
            ];
            // Cannot capture straight ahead.
            if (this.pieces[start + rank_delta] == 0) {
                step = [start + rank_delta];
                // Can step 2 squares ahead when on 2nd rank.
                if (board.getRank(start) === 1) {
                    if (this.pieces[start + (rank_delta * 2)] === 0) {
                        step = step.concat([start + (rank_delta * 2)]);
                    }
                }
            }
        } else {
            diagonals = [
                board.moveDirectionDelta.south_west,
                board.moveDirectionDelta.south_east
            ];
            // Cannot capture straight ahead.
            if (this.pieces[start - rank_delta] == 0) {
                step = [start - rank_delta];
                // Can step 2 squares ahead when on 7th rank.
                if (board.getRank(start) == 6) {
                    if (this.pieces[start - (rank_delta * 2)] == 0) {
                        step = step.concat([start - (rank_delta * 2)]);
                    }
                }
            }
        }
        for (var delta in diagonals) {
            if ((this.pieces[start + diagonals[delta]] != 0) ||
                    (start + diagonals[delta] === this.enpassant)) {
                moves.push(start + diagonals[delta]);
            }
        }
        moves = moves.concat(step);
        this.validMovesTable['pawn'][start] = moves;
        return moves;
    },
    /**
     * Make moves defining start and end squares in algebraic notation.
     *
     * @param {string} start The start square in algebraic notation.
     * @param {string} end The end square in algebraic notation.
     * @return {boolean} Wether the move has been done or not.
     */
    makeAlgebraicMove: function(start, end) {
        return this.makeMove(board.algebraicToNumber(start),
                board.algebraicToNumber(end));
    },

    /**
     * Checks if a move is valid.
     *
     * Rules & Constraints:
     *
     * 1) Cannot move when it's not your turn.
     * 2) Cannot capture same color pieces.
     * 3) Cannot capture the King.
     * 4) Pawn valid moves change depending on context.
     * 5) Cannot move on unreachable square for a given piece.
     * 6) Pawns can capture en passant.
     * 7) King can castle.
     * 8) All pieces except Knights cannot jump over obstacles.
     * 9) Must remove check if King is under attack. (TODO)
     * 10) Cannot move pinned pieces. (TODO)
     * 11) Handle pawn promotions. (TODO)
     *
     * @param {string|number} start The starting square.
     * @param {string|number} end The destination square.
     * @return {boolean} Wether the move has been done or not.
     */
    makeMove: function(start, end) {
        var temp_position = {};
        jQuery.extend(true, temp_position, this);

        start = parseInt(start, 10);
        end = parseInt(end, 10);
        if (start == end) {
            return false;
        }
        var moving_piece_abbr = temp_position.pieces[start];
        // Start square is empty
        if (moving_piece_abbr == 0) {
            return false;
        }
        var moving_piece = board.piecesAbbreviation[moving_piece_abbr];
        var moving_piece_color = board.getPieceColor(moving_piece_abbr);
        // Do not move when it's not your turn
        if (moving_piece_color != temp_position.trait) {
            return false;
        }
        var captured_piece_abbr = temp_position.pieces[end];
        // Do not capture same color pieces
        if (captured_piece_abbr !== 0 &&
                board.getPieceColor(captured_piece_abbr) === moving_piece_color) {
            return false;
        }
        // Cannot capture king
        if (captured_piece_abbr === 'K' || captured_piece_abbr === 'k') {
            return false;
        }
        // Regenerate valid moves array for the moving pawn
        if (moving_piece === 'pawn') {
            temp_position.validPawnMoves(moving_piece_color, start);
        }

        // Castling
        if (temp_position.handleCastling(moving_piece_abbr, moving_piece_color, start, end)) {
            temp_position.castling[moving_piece_color] = '';
            temp_position.toggleTrait();
            jQuery.extend(true, this, temp_position);
            return true;
        }

        // Do not move on an unreachable square
        if (temp_position.validMovesTable[moving_piece][start].indexOf(end) == -1) {
            return false;
        }

        // Sliding pieces cannot go after an obstacle
        if (temp_position.hasObstacles(moving_piece_abbr, start, end)) {
            return false;
        }

        // ======= //
        // DO MOVE //
        // ======= //

        // Handle normal and en passant capture
        temp_position.handleCapture(moving_piece_abbr, captured_piece_abbr, start, end);

        // Set the enpassant square if needed
        temp_position.setEnPassantSquare(moving_piece_abbr, start, end);

        // Set castling capabilities
        temp_position.setCastling(moving_piece_abbr, start);

        // Pawn Promotion
        moving_piece_abbr = temp_position.handlePawnPromotion(moving_piece_abbr, end);

        temp_position.pieces[start] = 0;
        temp_position.pieces[end] = moving_piece_abbr;

        // Restore board as it was before the mess because king has been left under
        // check
        if (temp_position.isUnderCheck(moving_piece_color)) {
            return false;
        }

        temp_position.toggleTrait();
        jQuery.extend(true, this, temp_position);
        // TODO: Apply changes to this based on temp_position
        return true;
    },

    /**
     * Performs castlings
     */
    handleCastling: function(piece, color, start, end) {
        if (piece.toUpperCase() != 'K') {
            return false;
        }

        function castleKingSide(position, start, end) {
            position.pieces[start] = 0;
            position.pieces[end] = piece;
            if (color == 'w') {
                position.pieces[7] = 0;
                position.pieces[5] = 'R';
            } else {
                position.pieces[0x77] = 0;
                position.pieces[0x75] = 'r';
            }
        }

        function castleQueenSide(position, start, end) {
            position.pieces[start] = 0;
            position.pieces[end] = piece;
            if (color == 'w') {
                position.pieces[0] = 0;
                position.pieces[3] = 'R';
            } else {
                position.pieces[0x70] = 0;
                position.pieces[0x73] = 'r';
            }
        }

        var castling_capabilities = this.castling[color];
        if (start - end == 2 && castling_capabilities.indexOf('q') != -1) {
            if (color == 'w' &&
                    this.pieces[1] == 0 &&
                    this.pieces[2] == 0 &&
                    this.pieces[3] == 0 ) {
                        castleQueenSide(this, start, end);
                        return true;
            }
            if (color == 'b' &&
                    this.pieces[0x71] == 0 &&
                    this.pieces[0x72] == 0 &&
                    this.pieces[0x73] == 0 ) {
                        castleQueenSide(this, start, end);
                        return true;
            }
        }
        if (start - end == -2 && castling_capabilities.indexOf('k') != -1) {
            if (color == 'w' &&
                    this.pieces[5] == 0 &&
                    this.pieces[6] == 0 ) {
                        castleKingSide(this, start, end);
                        return true;
            }
            if (color == 'b' &&
                    this.pieces[0x75] == 0 &&
                    this.pieces[0x76] == 0 ) {
                        castleKingSide(this, start, end);
                        return true;
            }
        }
        return false;
    },

    hasObstacles: function(piece, start, end) {
        function hasRookObstacles(position, start, end) {
            var direction;
            var delta = start - end;
            if (delta % 0x10 == 0) {
                direction = 0x10;
            } else {
                direction = 0x1;
            }
            var distance = delta / direction;
            for (var index = 1; index < Math.abs(distance); index ++) {
                if (distance < 0) {
                    var square = start + (index * direction);
                } else {
                    var square = start + (index * -direction);
                }
                if (position.pieces[square] != 0) {
                    return true;
                }
            }
            return false;
        }

        function hasBishopObstacles(position, start, end) {
            var delta = start - end;
            var direction;
            if (delta % 0x11 == 0) {
                direction = 0x11;
            } else {
                direction = 0xf;
            }
            var distance = delta / direction;
            for (var index = 1; index < Math.abs(distance); index ++) {
                if (distance < 0) {
                    var square = start + (index * direction);
                } else {
                    var square = start + (index * -direction);
                }
                if (position.pieces[square] != 0) {
                    return true;
                }
            }
            return false;
        }

        var piece_name = board.piecesAbbreviation[piece];
        if (piece.toUpperCase() == 'R') {
            return hasRookObstacles(this, start, end);
        }
        if (piece.toUpperCase() == 'B') {
            return hasBishopObstacles(this, start, end);
        }
        if (piece.toUpperCase() == 'Q') {
            var delta = start - end;
            if (delta % 0x11 == 0 || delta % 0xf == 0) {
                return hasBishopObstacles(this, start, end);
            } else {
                return hasRookObstacles(this, start, end);
            }
        }
        return false;
    },

    /**
     * Handle normal and en passant captures.
     *
     * @param {string} moving_piece_abbr The moving piece in algebraic representation.
     * @param {string} captured_piece_abbr The captured piece in algebraic representation.
     * @param {number} start The starting square number.
     * @param {number} end The ending square number.
     */
    handleCapture: function(moving_piece_abbr, captured_piece_abbr, start, end) {
        if (captured_piece_abbr != 0) {
            this.removeCaptured(end);
        } else {
            // En passant capture
            var diagonals = [
                board.moveDirectionDelta.north_east,
                board.moveDirectionDelta.north_west
            ];
            if (diagonals.indexOf(Math.abs(start - end)) != -1) {
                if (moving_piece_abbr == 'P') {
                    this.removeCaptured(end + board.moveDirectionDelta.south);
                }
                if (moving_piece_abbr == 'p') {
                    this.removeCaptured(end + board.moveDirectionDelta.north);
                }
            }
        }
    },

    setEnPassantSquare: function(piece_abbr, start, end) {
        if ('Pp'.indexOf(piece_abbr) == -1) {
            this.enpassant = '-';
        }
        if (Math.abs(start - end) == 0x20) {
            if (piece_abbr == 'P') {
                this.enpassant = start + 0x10;
            }
            if (piece_abbr == 'p') {
                this.enpassant = start - 0x10;
            }
        } else {
            this.enpassant = '-';
        }
    },
    setCastling: function(piece, start) {
        if (piece == 'K') {
            this.castling['w'] = '';
        }
        if (piece == 'k') {
            this.castling['b'] = '';
        }
        if (piece == 'R' && start == 0) {
            this.castling['w'] = this.castling['w'].replace('q', '');
        }
        if (piece == 'R' && start == 7) {
            this.castling['w'] = this.castling['w'].replace('k', '');
        }
        if (piece == 'r' && start == 0x70) {
            this.castling['b'] = this.castling['b'].replace('q', '');
        }
        if (piece == 'r' && start == 0x77) {
            this.castling['b'] = this.castling['b'].replace('k', '');
        }
    },
    getKingPosition: function(color) {
        if (color == 'w') {
            var king = 'K';
        } else {
            var king = 'k';
        }
        for (var index = 0; index < 0x80; index++) {
            if (this.pieces[index] === king) {
                var king_position = index;
            }
        }
        return king_position;
    },
    /**
     * If a pawn reaches its last rank it is automatically promoted to Queen.
     *
     * TODO: handle user choice.
     *
     * @param {string} piece_abbr A piece in algebraic representation.
     * @return {string} Queen or original piece.
     */
    handlePawnPromotion: function(piece_abbr, end) {
        if (piece_abbr == 'P' && board.getRank(end) == 7) {
            return 'Q';
        }
        if (piece_abbr == 'p' && board.getRank(end) == 0) {
            return 'q';
        }
        return piece_abbr;
    },

    isUnderCheck: function(color) {
        var king_position = this.getKingPosition(color);
        // Sliding pieces
        var starting_squares = this.validMovesTable.queen[king_position];
        for (var index = 0; index < starting_squares.length; index++) {
            var start = starting_squares[index];
            var piece = this.pieces[start];
            if (
                    // There is a piece on the square
                    (piece != 0)
                    // The piece is one among Queen, Rook and Bishop
                    && ('QBRqbr'.indexOf(piece) != -1)
                    // The piece is not of the same color of the king
                    && (board.getPieceColor(piece) != color)
                    && (this.validMovesTable[board.piecesAbbreviation[piece]][start].indexOf(king_position) != -1)
                    // The piece has no obstacles
                    && (!this.hasObstacles(piece, start, king_position))
                    ) {
                        return true;
            }
        }
        // Knights
        var starting_knight_squares = this.validMovesTable.knight[king_position];
        for (var index = 0; index < starting_knight_squares.length; index++) {
            var start = starting_knight_squares[index];
            var piece = this.pieces[start];
            if (piece != 0 
                    && ('Nn'.indexOf(piece) != -1)
                    && (board.getPieceColor(piece) != color)) {
                        return true;
            }
        }
        // pawn checks
        // TODO
        return false;
    }
};



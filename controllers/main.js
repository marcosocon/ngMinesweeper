angular.module('ngMinesweeper')
	.controller('MainCtrl', function ($scope, _) {
		var self = this;

		//set initial state for the game.
		self.state = {
			board: [],
			gameOver: false,
			flagsLeft: 0,
			boardColumns: 0,
			boardRows: 0,
			mines: 0
		};

		// initialize game and return state.
		self.init = function (rows, cols, mines) {
			self.state.boardRows = rows || 10;
			self.state.boardColumns = cols || 10;
			self.state.mines = mines || 10;

			self.resetGame();

			return self.state;
		};

		// creates the matrix.
		self.createBoard = function () {
			self.state.board = _.times(self.state.boardRows, function (row) {
				return _.times(self.state.boardColumns, function (col) {
					return {
						row: row,
						col: col,
						opened: false,
						hasFlag: false,
						isMine: false,
						nearMines: null
					};
				});
			});
		};

		// adds the mines randomly in the board.
		self.addMines = function() {
			var cells = _.sampleSize(_.flatten(self.state.board), self.state.mines);
			_.forEach(cells, function (cell) {
				cell.isMine = true;
			});
		};

		// set the cell nearMines number
		self.setNearMines = function() {
			_.forEach(self.getClosedNonMinesCells(), function (cell) {
				var nearMines = _.filter(self.getCellsAround(cell), { isMine: true });
				cell.nearMines = nearMines.length > 0 ? nearMines.length : null;
			});
		};

		// get an array of all current closed and non mines cells.
		self.getClosedNonMinesCells = function() {
			return _.filter(_.flatten(self.state.board), { isMine: false, opened: false });
		};

		// get all cells around a specific cell and itself.
		self.getCellsAround = function(cell) {
			var cells = [];

			_.forEach(_.range(-1, 2), function (i) {
				_.forEach(_.range(-1, 2), function (j) {
					var row = self.state.board[cell.row + i];
					var col = cell.col + j;

					// cell validation.
					(_.isUndefined(row) || _.isUndefined(row[col])) ? _.noop() : cells.push(row[col]);
				});
			});

			return cells;
		};

		// reveal a cell
		self.openCell = function (row, col, evt) {
			if(evt && evt.which && evt.which === 3) {
				self.toggleFlag(row, col);
				return false;
			}

			if (self.state.gameOver) return;

			var flatBoard = _.flatten(self.state.board);
			var cell = _.find(flatBoard, { row: row, col: col });
			cell.opened = true;

			// if this cell is empty, open all near cells
			var toReveal = (!cell.isMine && cell.nearMines === null) ?
				_.filter(self.getCellsAround(cell), { opened: false, hasFlag: false }) : [];

			// if cell is a mine, open all other bombs
			toReveal = (cell.isMine) ? _.filter(flatBoard, { opened: false, isMine: true, hasFlag: false }) : toReveal;

			// cascade mecanism to open cells
			_.forEach(toReveal, function (cell) {
				self.openCell(cell.row, cell.col);
			});

			// set gameOver depending on the cell content.
			self.state.gameOver = cell.isMine || self.getClosedNonMinesCells().length === 0;
			return self.state.gameOver;
		};

		// toggle the hasFlag property of a cell
		self.toggleFlag = function(row, col) {
			if (self.state.gameOver) return;

			var cell = _.find(_.flatten(self.state.board), { row: row, col: col });

			if (self.state.flagsLeft === 0 && !cell.hasFlag) return;

			cell.hasFlag = !cell.hasFlag;
			self.state.flagsLeft -= cell.hasFlag ? 1 : -1;
		};


		// reset game to beginning.
		self.resetGame = function () {
			self.createBoard();
			self.addMines();
			self.setNearMines();

			self.state.gameOver = false;
			self.state.flagsLeft = self.state.mines;
		};

		self.init(9, 9, 9);
	});
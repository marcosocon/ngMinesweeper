angular.module('ngMinesweeper')
	.controller('MainCtrl', function ($scope, _) {
		var self = this;

		//set initial state for the game
		self.state = {
			board: [],
			gameOver: false,
			flagsLeft: 0,
			boardColumns: 0,
			boardRows: 0,
			mines: 0
		};

		// initialize game and return state
		self.init = function (rows, cols, mines) {
			self.state.boardRows = rows || 10;
			self.state.boardColumns = cols || 10;
			self.state.mines = mines || 10;

			self.resetGame();

			return self.state;
		};

		// creates the matrix
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

		// reset game to beginning
		self.resetGame = function () {
			self.state.gameOver = false;
			self.state.flagsLeft = self.state.mines;

			self.createBoard();
		};
	});
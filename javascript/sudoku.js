var gameNumbers = ['del',1,2,3,4,5,6,7,8,9];
var generateBlankBoard = function() {
  var board = [
    [8, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 1, 0, 0, 0, 9],
    [1, 7, 0, 4, 3, 0, 0, 0, 0],
    [9, 0, 8, 5, 0, 0, 0, 6, 2],
    [0, 4, 0, 9, 6, 7, 0, 8, 0],
    [7, 6, 0, 0, 0, 8, 5, 0, 4],
    [0, 0, 0, 2, 0, 9, 0, 7, 1],
    [7, 0, 0, 0, 5, 0, 0, 0, 8],
    [0, 0, 0, 0, 0, 0, 0, 0, 5]
  ]

  return board.map(function(segment, index){
    return segment.map(function(cell, i){
      return {
        number: cell,
        loc: { x: index, y: i },
        isClickable: (cell === 0),
        isActive: false
      };
    })
  })
}

var cellChecker = function(sudokuBoard, cell) {
  var allNumbers = [];
  var allNumbers = allNumbers.concat(sudokuBoard[cell.loc.x]);
  var rowX = Math.floor(cell.loc.x / 3) * 3;
  var rowY = Math.floor(cell.loc.y / 3) * 3;
  var rem = { x: cell.loc.x % 3, y: cell.loc.y % 3 };

  sudokuBoard.forEach(function(set,i) {
    if (i >= rowX && i < (rowX + 3)) {
      set.forEach(function(number,numIndex){
        if (numIndex >= rowY && numIndex < (rowY + 3)) {
          allNumbers.push(number);
        }
      })
    }
  })

  sudokuBoard.forEach(function(set,i){
    if ((i % 3) === rem.x) {
      set.forEach(function(n,numIndex){
        if (rem.y === (numIndex % 3)) {
          allNumbers.push(n);
        }
      })
    }
  })

  for (var i = 0; i < allNumbers.length; i++) {
    var value = allNumbers[i]
    if (cell.number === value.number) {
      return false;
    }
  }

  return true;
}

var Sudoku = React.createClass({displayName: 'Sudoku',

  getInitialState: function() {
    return {
      board: generateBlankBoard(),
      activeCell: {}
    };
  },

  handleNumberSelect: function(e, cell) {
    var board = this.state.board;
    if (e.which === 8) {
      board[cell.loc.x][cell.loc.y].number = 0;
    } else if (_.isNaN(cell.number)) {
      return;
    } else {
      if (cellChecker(board, cell)) {
        board[cell.loc.x][cell.loc.y].number = cell.number;
      } else {
        alert('invalid entry. Try again')
      }
    }

    this.setState({ board: board })
  },

  makeCellActive: function(e, cell) {
    var board = this.state.board;
    var prevCell = this.state.activeCell;

    if (prevCell.isActive) {
      prevCell.isActive = false;
      board[prevCell.loc.x][prevCell.loc.y] = prevCell;
    }
    var activeCell = board[cell.loc.x][cell.loc.y];
    activeCell.isActive = true;
    board[cell.loc.x][cell.loc.y] = activeCell;

    this.setState({ board: board, activeCell: activeCell })
  },

  render: function() {
    var self = this;
    var board = this.state.board.map(function(cells){
      return (
        React.createElement(Segment, {cells: cells, makeCellActive: self.makeCellActive, handleSelection: self.handleNumberSelect})
      )
    })

    return (
      React.createElement("div", {id: "sudoku"}, 
        React.createElement("div", {id: "game-board"}, 
          board
        )
      )
    )
  }
})

var Segment = React.createClass({displayName: 'Segment',
  render: function() {
    var self = this;
    var cells = this.props.cells.map(function(cell){
      return (
        React.createElement(Cell, React.__spread({},  cell, {cellActive: self.props.makeCellActive, handleSelection: self.props.handleSelection}))
      )
    })

    return (
      React.createElement("div", {className: "segment"}, 
        cells
      )
    )
  }
})

var Cell = React.createClass({displayName: 'Cell',
  selectNumber: function(e) {
    var cell = this.props;
    cell.number = parseInt(String.fromCharCode(e.which), 10);
    this.props.handleSelection(e, cell);
  },

  makeCellActive: function(e) {
    if (this.props.isClickable) {
      this.props.cellActive(e, this.props)
    }
  },

  render: function() {
    var num = this.props.number === 0 ? "" : this.props.number;
    var style = { backgroundColor: this.props.isActive ? "#b4cdcd" : "#bbbbbb" };
    return (
      React.createElement("div", {onClick: this.makeCellActive}, 
        React.createElement("div", {style: style, className: "game-cell"}, num, 
          React.createElement("input", {className: "cell-placeholder", style: {opacity: "0"}, value: num, onKeyDown: this.selectNumber, type: "text", ref: "theInput"})
        )
      )
    )
  }
})

var renderBoard = function() {
  React.render(
    React.createElement(Sudoku, null),
    document.getElementById("game")
  )
}
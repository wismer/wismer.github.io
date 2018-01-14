var arrowKeys = [37,38,39,40];

// RULES FOR GAME OF LIFE SO I DON'T HAVE TO KEEP REFERENCING THE DAMN WIKI:
// Live cell with less than 2 live cells? DIE.
// Live cell with 2-3 live neighbors? Survives (i.e. it doesn't die)
// Live cell with more than 3 neighbors dies.
// Dead cell with exactly (===) 3 neighbor lives.

var Life = function(set) {
  this.board = set;
  this.activeCells = [];
  this.zone = function(x,y) {
    return [
      {x: x - 1, y: y - 1},
      {x: x - 1, y: y + 1},
      {x: x + 1, y: y - 1},
      {x: x + 1, y: y + 1},
      {x: x, y: y + 1},
      {x: x, y: y - 1},
      {x: x + 1, y: y},
      {x: x - 1, y: y}
    ];
  }
}

Life.prototype = {
  isActive: function(x,y) {
    if (x < 0 || y < 0) {
      return false;
    } else if (x >= 50 || y >= 50) {
      return false;
    } else {
      return true;
    }
  },

  activeZone: function(x,y,board) {
    var zone = this.zone(x,y);
    var self = this;

    zone = zone.filter(function(cell){
      return self.isActive(cell.x, cell.y);
    })

    return zone.map(function(cell){
      cell.isAlive = board[cell.x][cell.y].isAlive;
      if (!cell.isAlive) {
        board[cell.x][cell.y].aliveNeighbors += 1;
      }
      return cell;
    })
  },

  staysAlive: function(cell) {
    var cellArea = cell.zone.filter(function(neighbor){
      return neighbor.isAlive;
    })
    if (cellArea.length < 4 && cellArea.length > 1) {
      return true;
    } else {
      return false;
    }
  },

  step: function(board) {
    var activeCells = this.activeCells;
    var self = this;
    board.forEach(function(row, x){
      row.forEach(function(cell, y){
        if (cell.isAlive) {
          var activeCell = { x: x, y: y, isAlive: true };
          // zone returns all the in-bound cell locations.
          activeCell.zone = self.activeZone(x,y,board);
          activeCells.push(activeCell);
        }
      })
    })

    activeCells.forEach(function(cell){
      board[cell.x][cell.y].isAlive = self.staysAlive(cell);
    })

    this.activeCells = [];

    board.forEach(function(row,x){
      row.forEach(function(cell,y){
        if (cell.aliveNeighbors === 3) {
          board[x][y].isAlive = true;
        }

        board[x][y].aliveNeighbors = 0;
      })
    })

    return board;
  }
}

var generateSeed = function() {
  var board = [];
  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  for (var i = 0; i < 50; i++) {
    var set = [];
    for (var a = 0; a < 50; a++) {
      var random = Math.floor(Math.random() * alpha.length)
      set.push({x: i, y: a, isAlive: false, aliveNeighbors: 0});
    }

    board.push(set);
  }

  return board;
}

var life = new Life();

var TableMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },

  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments))
  },

  componentWillReceiveProps: function() {
    this.intervals.map(clearInterval);
  }
}

var CellTable = React.createClass({displayName: 'CellTable',
  mixin: [TableMixin],

  getInitialState: function() {
    return { board: generateSeed(), intervals: [] };
  },

  addClump: function(cell) {
    var board = this.state.board;
    var zone = life.activeZone(cell.x, cell.y, board);

    zone.forEach(function(c,i){
      board[c.x][c.y].isAlive = true;
    })

    this.state.intervals.map(clearInterval)
    this.setState({ board: board, intervals: [setInterval(this.updateBoard, 100)] })
  },

  updateBoard: function() {
    var board = this.state.board;
    var newBoard = life.step(board);
    this.setState({ board: newBoard });
  },

  render: function() {
    var self = this;
    var rows = this.state.board.map(function(row, index){
      return (React.createElement(CellRow, {addClump: self.addClump, row: row}))
    })

    return (
      React.createElement("div", {id: "table"}, rows)
    )
  }
})

var CellRow = React.createClass({displayName: 'CellRow',
  render: function() {
    var self = this;
    var cells = this.props.row.map(function(cell){
      return (React.createElement(Cell, React.__spread({key: cell.y, addClump: self.props.addClump.bind(null, cell)},  cell)) )
    })
    return (
      React.createElement("div", {className: "cell-row"}, cells)
    )
  }
})

var Cell = React.createClass({displayName: 'Cell',
  render: function() {
    var style = { backgroundColor: this.props.isAlive ? "black" : "white" };
    return (
      React.createElement("div", {onClick: this.props.addClump, className: "cell", style: style})
    )
  }
})

var renderTab = function() {
  React.render(
    React.createElement(CellTable, null),
    document.getElementById("tab")
  )
}
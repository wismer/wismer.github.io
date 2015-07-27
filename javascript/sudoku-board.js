var Board = function() {
  var row = [0,0,0,0,0,0,0,0,0];
  this.grid = [row, row, row, row, row, row, row, row, row];
}

var SudokuBoard = React.createClass({displayName: 'SudokuBoard',
  getInitialState: function() {
    return { board: new Board() };
  },

  render: function() {
    return (
      React.createElement("div", {id: "game-board"}, 
        React.createElement("table", null, 
          "dash"
        )
      )
    )
  }
})

var Row = React.createClass({displayName: 'Row',
  render: function() {
    var cells = this.props.cells.map(function(cell){
      return React.createElement(Cell, React.__spread({},  cell))
    })

    return (
      React.createElement("tr", null, cells)
    )
  }
})

var Cell = React.createClass({displayName: 'Cell',
  render: function() {
    return React.createElement("td", null)
  }
})

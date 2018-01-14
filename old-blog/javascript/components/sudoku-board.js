var Board = function() {
  var row = [0,0,0,0,0,0,0,0,0];
  this.grid = [row, row, row, row, row, row, row, row, row];
}

var SudokuBoard = React.createClass({
  getInitialState: function() {
    return { board: new Board() };
  },

  render: function() {
    return (
      <div id='game-board'>
        <table>
          dash
        </table>
      </div>
    )
  }
})

var Row = React.createClass({
  render: function() {
    var cells = this.props.cells.map(function(cell){
      return <Cell {...cell} />
    })

    return (
      <tr>{cells}</tr>
    )
  }
})

var Cell = React.createClass({
  render: function() {
    return <td></td>
  }
})

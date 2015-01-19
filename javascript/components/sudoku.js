var arrowKeys = [37,38,39,40];

var Life = function() {
  this.board = [];
  this.activeCells = [];
  this.cellStructure = {};
}

Life.prototype = {
  
}


var life = new Life();

var generateLetters = function() {
  var board = [];
  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  for (var i = 0; i < 50; i++) {
    var set = [];
    for (var a = 0; a < alpha.length; a++) {
      var random = Math.floor(Math.random() * alpha.length)
      var letter = alpha[random];
      set.push({ isActive: false, letter: letter, x: i, y: a });
    }

    board.push(set);
  }

  return board;
}

var initialBoard = generateLetters();
var TabTable = React.createClass({
  getInitialState: function() {
    return { board: initialBoard, activeCell: {} };
  },

  componentWillMount: function() {
    var board = this.state.board;
    var firstLetter = board[0][0];
    firstLetter.isActive = true;
    this.setState({ activeCell: firstLetter })
  },

  moveKey: function(e) {
    if (_.contains(arrowKeys, e.which)) {
      if (e.which === 37) {
        
      }
    }
  },

  activeCell: function(e, cell) {
    var board = this.state.board;
    var prevCell = this.state.activeCell;
    var activeCell = board[cell.x][cell.y];
    activeCell.isActive = true;
    board[cell.x][cell.y] = activeCell;

    this.setState({ board: board, activeCell: activeCell })
  },

  render: function() {
    var self = this;
    var rows = this.state.board.map(function(row, index){
      return (
        <TabTableRow moveKey={self.moveKey} activeCell={self.activeCell} row={row} x={index} />
      )
    })
    return (
      <div id='tab-table'>{rows}</div>
    )
  }
})

var TabTableRow = React.createClass({
  render: function() {
    var self = this;
    var coord = { x: this.props.x };
    var letters = this.props.row.map(function(letter, index){
      coord.y = index;
      return (
        <Letter moveKey={self.props.moveKey} activeCell={self.props.activeCell} coord={coord} {...letter} />
      )
    })
    return (
      <div className='letter-row'>{letters}</div>
    )
  }
})

var Letter = React.createClass({
  highlightCell: function(e) {
    this.refs.inputLetter.getDOMNode().focus();
    this.props.activeCell(e, this.props)
  },

  moveKey: function(e) {
    this.props.moveKey(e)
  },

  render: function() {
    var style = { backgroundColor: this.props.isActive ?  "#b4cdcd" : "#bbbbbb"  };
    var letter = this.props.letter
    return (
      <div onClick={this.highlightCell} style={style} className='letter'>{letter}<input onKeyDown={this.props.moveKey} ref="inputLetter" className='holder' type='text' value={this.props.letter}></input></div>
    )
  }
})


var renderTab = function() {
  React.render(
    <TabTable />,
    document.getElementById("tab")
  )
}
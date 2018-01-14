
var QueryBar = React.createClass({
  getInitialState: function() {
    return { sets: [], currentSets: [] };
  },

  componentDidMount: function() {
    $.getJSON(this.props.url, function(data){
      this.setState({ sets: data })
    }.bind(this))
  },

  query: function(e) {
    var sets = this.state.sets;
    var setName = e.target.value;
    var re = new RegExp(setName, "i");
    var newSets = [];
    var prevSets = this.state.currentSets;

    var currentSets = sets.filter(function(set){
      return re.exec(set.name) !== null;
    })

    currentSets.forEach(function(set){
      set.getCards = e.which === 13;
    })

    this.setState({ currentSets: currentSets })
  },

  render: function() {
    var sets = this.state.sets;
    var self = this;
    var newSets = this.state.currentSets.map(function(set){
      return <Expansion {...set} />
    })

    return (
      <div id='expansions'>
        <input onKeyDown={this.query} type='text'></input>
        <div id='expansion-list'>
          {newSets}
        </div>
      </div>
    )
  }
})

var Expansion = React.createClass({
  componentDidMount: function() {
    if (this.props.getCards) {
      $.getJSON("http://mtgjson.com/json/" + this.props.code + ".json", function(data){
        this.setState({ cards: data.cards })
      }.bind(this))
    }
  },

  render: function() {
    var set = this.props;

    return (
      <div className='set'>{set.name}</div>
    )
  }
})


// var ExpansionList = React.createClass({
//   getInitialState: function() {
//     return { display: false };
//   },

//   displayList: function(e) {
//     e.preventDefault();
//     this.setState({ display: !this.state.display })
//   },

//   selectYear: function(year, e) {
//     e.preventDefault();
//     this.props.selectedYear(year);
//   },

//   render: function() {
//     var sets = this.props.sets;
//     var self = this;
//     var years = Object.keys(sets);
//     var subSets = years.map(function(year){
//       var count = sets[year].length;
//       return (
//         <div className='exp'>
//           <a href='#' onClick={self.selectYear.bind(null, year)}><h5>{year} <span className="exp-count">{count}</span></h5></a>
//         </div>
//       )
//     })

//     var display = this.state.display ? { display: 'block' } : { display: 'none' }

//     return (
//       <div id='expansion-list' onMouseLeave={this.displayList}>
//         <a href='#' className='exp-button' onClick={this.displayList}><h5>EXPANSIONS</h5></a>
//         <div id='list' style={display}>
//           {subSets}
//         </div>
//       </div>
//     )
//   }
// })

// var ExpansionDetail = React.createClass({
//   render: function() {
//     return ( <div id='detail'></div> )
//   }
// })

// var ExpansionSubList = React.createClass({
//   render: function() {
//     var name = this.props.name;

//     return (
//       <div className='exp-year'>
//         <a href='#'><h5>{name}</h5></a>
//       </div>
//     )
//   }
// })

var renderStuff = function() {
  React.render(
    <QueryBar url="http://mtgjson.com/json/SetList.json"/>,
    document.getElementById("querybar")
  )
}
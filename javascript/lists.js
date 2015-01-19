var Magic = React.createClass({displayName: 'Magic',
  getInitialState: function() {
    return { setList: [], activeYears: []}
  },

  componentWillMount: function() {
    var years = {}
    $.getJSON("http://mtgjson.com/json/SetList.json", function(data){
      setsByReleaseDate = data.map(function(set){
        var year = new Date(set.releaseDate).getFullYear();

        if (years[year]) {
          years[year].push(set);
        } else {
          years[year] = [set];
        }
      })

      this.setState({ setList: years })
    }.bind(this))
  },

  getExpansionCards: function(code, year) {
    var expansions = this.state.setList;

    $.getJSON("http://mtgjson.com/json/" + code + ".json", function(data){
      expansions[year][code] = data;
      this.setState({ setList: expansions })
    }.bind(this))
  },

  byYear: function(year, e) {

  },

  render: function() {
    var setList = this.state.setList;
    var self = this;
    var years = Object.keys(setList).map(function(year){
      var sets = setList[year];
      return (
        React.createElement(YearList, {byYear: self.byYear.bind(self, year), year: year, sets: sets})
      )
    })

    return (
      React.createElement("div", {id: "year-portal"}, 
        React.createElement("div", {id: "year-list"}, 
          years
        ), 

        React.createElement("div", {id: "year-detail"}
        )
      )
    )
  }
})

var YearList = React.createClass({displayName: 'YearList',
  getInitialState: function() {
    return { active: false };
  },

  changeActive: function(e) {
    e.preventDefault();
    var active = !this.state.active;
    this.setState({ active: active })
  },

  render: function() {
    var active = this.state.active ? 'year-active' : 'year';
    return (
       React.createElement("a", {href: "#", onClick: this.changeActive}, React.createElement("div", {className: active}, this.props.year))
    )
  }
})

var Expansion = React.createClass({displayName: 'Expansion',
  render: function() {
    React.createElement("div", {className: "expansion"}, 
      React.createElement("a", {href: "#"}, React.createElement("h5", null, this.props.name))
    )
  }
})

var renderMagic = function() {
  React.render(
    React.createElement(Magic, null),
    document.getElementById("year-set")
  )
}
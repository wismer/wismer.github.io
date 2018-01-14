var Magic = React.createClass({
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
        <YearList byYear={self.byYear.bind(self, year)} year={year} sets={sets} />
      )
    })

    return (
      <div id='year-portal'>
        <div id='year-list'>
          {years}
        </div>

        <div id='year-detail'>
        </div>
      </div>
    )
  }
})

var YearList = React.createClass({
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
       <a href='#' onClick={this.changeActive}><div className={active}>{this.props.year}</div></a>
    )
  }
})

var Expansion = React.createClass({
  render: function() {
    <div className='expansion'>
      <a href='#'><h5>{this.props.name}</h5></a>
    </div>
  }
})

var renderMagic = function() {
  React.render(
    <Magic />,
    document.getElementById("year-set")
  )
}
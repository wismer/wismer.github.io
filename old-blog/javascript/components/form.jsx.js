var FormField = React.createClass({
  getInitialState: function() {
    return { expansions: [], collection: {}, currentView: [] }
  },

  loadExpansions: function() {
    var expansions = this.state.expansions;

    $.getJSON("/images/AllSets.json", function(exps){
      var expansions = []
      Object.keys(exps).forEach(function(code){
        if (exps[code].booster) {
          expansions.push(exps[code])
        }
      })

      this.setState({
        expansions: expansions,
        expansionsLoaded: true
      })
    }.bind(this))
  },

  getCards: function(e) {
    var cardCollection = this.state.collection;
    var code = e.target.value
    var expansionJSON = "http://mtgjson.com/json/" + code + ".json"
    if (cardCollection[code] === undefined) {
      $.getJSON(expansionJSON, function(exp) {
        cardCollection[code] = exp;
        this.setState({
          collection: cardCollection,
          currentView: cardCollection[code]
        })
      }.bind(this))
    }
  },

  render: function() {
    console.log(this.state)
    var expansions = this.state.expansions.map(function(exp){
      return (
        <option value={exp.code}>{exp.name}</option>
      )
    })

    return (
      <div className='expansion-list'>
        <button onClick={this.loadExpansions}>load expansion list</button>
        <select onChange={this.getCards}>
          <option>Select An Expansion</option>
          {expansions}
        </select>
        <CardCarousel expansion={this.state.currentView} />
      </div>
    )
  }
})



var renderForm = function() {
  React.render(
    <FormField />,
    document.getElementById("form-comp")
  )
}

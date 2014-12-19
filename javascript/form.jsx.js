var FormField = React.createClass({displayName: 'FormField',
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
        React.createElement("option", {value: exp.code}, exp.name)
      )
    })

    return (
      React.createElement("div", {className: "expansion-list"}, 
        React.createElement("button", {onClick: this.loadExpansions}, "load expansion list"), 
        React.createElement("select", {onChange: this.getCards}, 
          React.createElement("option", null, "Select An Expansion"), 
          expansions
        ), 
        React.createElement(CardCarousel, {expansion: this.state.currentView})
      )
    )
  }
})

var CardCarousel = React.createClass({displayName: 'CardCarousel',
  getInitialState: function() {
    return { inView: [], inQueue: {up: [], down: []}, booster: [] }
  },

  render: function() {
    var cards = this.props.expansion.cards === undefined ? [] : this.props.expansion.cards
    return (
      React.createElement("div", {id: "card-carousel"}, 
        React.createElement("div", {id: "view-up"}, 
          React.createElement("button", {onClick: this.shiftUp}, "Shift Up")
        ), 

        React.createElement("div", {id: "cards"}
          
        ), 

        React.createElement("div", {id: "view-down"}, 
          React.createElement("button", {onClick: this.shiftUp}, "Shift Down")
        )
      )
    )
  }
})


var renderForm = function() {
  React.render(
    React.createElement(FormField, null),
    document.getElementById("form-comp")
  )
}

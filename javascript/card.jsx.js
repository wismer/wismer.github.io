var Card = React.createClass({displayName: 'Card',
  render: function() {
    return (
      React.createElement("div", {id: "card"}, 
        React.createElement(CardTemplate, null)
      )
    )
  }
})

var CardTemplate = React.createClass({displayName: 'CardTemplate',
  render: function() {
    return ( React.createElement("img", {src: "/images/magic-card-template.png", height: "300", width: "175"}) )
  }
})


var TypeForm = React.createClass({displayName: 'TypeForm',
  getInitialState: function() {

    var fonts = [
      "'Yellowtail', cursive",
      "'Fauna One', serif",
      "'Droid Sans Mono'",
      "'Kreon', serif",
      "'PT Serif', serif",
      "'Monda', sans-serif",
      "'Libre Baskerville', serif",
      "'Alegreya Sans', sans-serif",
      "'Ubuntu Condensed', sans-serif",
      "'Yanone Kaffeesatz', sans-serif",
      "'Audiowide', cursive",
      "'Amaranth', sans-serif",
      "'Damion', cursive"
    ]

    return { value: "", countTimes: 1, fontStyles: fonts }
  },

  showOff: function(e) {
    var countTimes = this.state.countTimes
    this.setState({
      value: e.target.value,
      countTimes: countTimes + 1
    })
  },

  render: function() {
    var fonts = this.state.fontStyles
    var letters = this.state.value.split("").map(function(letter){
      var i = Math.floor((Math.random() * 3))
      return (
        React.createElement("span", {style: {fontFamily: fonts[i]}}, letter)
      )
    })
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "input", style: {float: "left"}}, 
          React.createElement("textarea", {rows: "20", cols: "25", type: "text", onInput: this.showOff})
        ), 
        React.createElement("div", {className: "output", style: {float: "right", letterSpacing: '1em', fontSize: '1.25em'}}, 
          React.createElement("p", null, letters)
        )
      )
    )
  }
})

var renderTyper = function() {
  React.render(
    React.createElement(TypeForm, null),
    document.getElementById("magic-cards")
  )
}

var renderCard = function() {
  React.render(
    React.createElement(Card, null),
    document.getElementById("magic-cards")
  )
}

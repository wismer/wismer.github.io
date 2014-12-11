var Deck = React.createClass({displayName: 'Deck',
  render: function() {
    return (
      React.createElement("div", {class: "card"}, 
        "deck", 
        React.createElement(Card, null)
      )
    )
  }
})

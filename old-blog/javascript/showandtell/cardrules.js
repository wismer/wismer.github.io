var CardRules = React.createClass({displayName: 'CardRules',
  render: function() {
    var style = { backgroundColor: this.props.active ? "#B9B0A9" : "" };
    var nodePath = ["activeView", "activeCard", "cardRules"];
    var mouseLeave = this.props.mouseOver.bind(null, nodePath, false)
    var mouseEnter = this.props.mouseOver.bind(null, nodePath, true)
    return (
      React.createElement("article", {onMouseEnter: mouseEnter, onMouseLeave: mouseLeave, style: style}, 
        React.createElement("p", null, 
          this.props.rules
        )
      )
    )
  }
})

module.exports = CardRules;

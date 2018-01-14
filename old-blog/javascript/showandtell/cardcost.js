var CardCost = React.createClass({displayName: 'CardCost',
  render: function() {
    var style = { backgroundColor: this.props.active ? "#B9B0A9" : "" };
    var nodePath = ["activeView", "activeCard", "cardCost"];
    var mouseLeave = this.props.mouseOver.bind(null, nodePath, false)
    var mouseEnter = this.props.mouseOver.bind(null, nodePath, true)
    return (
      React.createElement("p", {onMouseEnter: mouseEnter, onMouseLeave: mouseLeave, style: style}, this.props.cost)
    )
  }
})

module.exports = CardCost;

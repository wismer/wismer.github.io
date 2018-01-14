var CardRules = React.createClass({
  render: function() {
    var style = { backgroundColor: this.props.active ? "#B9B0A9" : "" };
    var nodePath = ["activeView", "activeCard", "cardRules"];
    var mouseLeave = this.props.mouseOver.bind(null, nodePath, false)
    var mouseEnter = this.props.mouseOver.bind(null, nodePath, true)
    return (
      <article onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} style={style}>
        <p>
          {this.props.rules}
        </p>
      </article>
    )
  }
})

module.exports = CardRules;

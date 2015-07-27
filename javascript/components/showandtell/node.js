
var Node = React.createClass({
  preventClick: function(e) {
    e.preventDefault();
  },

  render: function() {
    var children = React.Children.count(this.props.children) > 0
      ? this.props.children
      : ""
    var style = { opacity: this.props.active ? "1.0" : "0.5" };

    var beginTag = "<" + this.props.node + ">\n";
    var endTag = "</" + this.props.node + ">";
    var mouseEvent = this.props.mouseEvent;
    return (
      <div>
        <div style={style}>
          {this.props.level}
          <a
            onMouseEnter={mouseEvent.bind(null, this.props.node, true)}
            onMouseLeave={mouseEvent.bind(null, this.props.node, false)}
            onClick={this.preventClick} href="#">
            {beginTag}
          </a>
        </div>
        <div>
          {children}
        </div>
        <div style={style}>
          {this.props.level}
          <a
            onMouseEnter={mouseEvent.bind(null, this.props.node, true)}
            onMouseLeave={mouseEvent.bind(null, this.props.node, false)}
            onClick={this.preventClick} href="#">
            {endTag}
          </a>
        </div>
      </div>
    )
  }
})

module.exports = Node;

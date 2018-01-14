var ActiveView = React.createClass({
  render: function() {
    var treePath = ["activeView"];
    var mouseOver = this.props.mouseOver;
    var style = {
      float: "left",
      width: "50%",
      backgroundColor: this.props.isActive ? "#D6D4E4" : ""
    };

    return (
      <div
        onMouseEnter={mouseOver.bind(null, treePath, true)}
        onMouseLeave={mouseOver.bind(null, treePath, false)}
        id='active-view' style={style}>
        {this.props.children}
      </div>
    )
  }
})

module.exports = ActiveView;
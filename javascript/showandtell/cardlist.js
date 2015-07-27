var CardList = React.createClass({displayName: 'CardList',
  render: function() {
    var mouseOver = this.props.mouseOver;
    var treePath = ["activeView", "cardList"];
    var style = {
      width: "50%",
      float: "left",
      backgroundColor: this.props.isActive ? "#D6D4E4" : ""
    };

    return (
      React.createElement("div", {
        onMouseLeave: mouseOver.bind(null, treePath, false), 
        onMouseEnter: mouseOver.bind(null, treePath, true), id: "card-list", style: style}, 
        this.props.children
      )
    )
  }
})

module.exports = CardList;

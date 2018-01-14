var Node = require("codeview");

var CodeView = React.createClass({displayName: 'CodeView',
  render: function() {
    var mouseEvent = this.props.mouseEvent;
    return (
      React.createElement("div", null, 
        React.createElement("pre", null, 
          "// click on a node to view props and other properties.\"", 
          React.createElement(Node, React.__spread({mouseEvent: mouseEvent},  this.props.activeView), 
            React.createElement(Node, React.__spread({mouseEvent: mouseEvent},  this.props.cardList, {level: "  "}), 
              React.createElement(Node, React.__spread({mouseEvent: mouseEvent},  this.props.card, {level: "    "}))
            ), 
            React.createElement(Node, React.__spread({mouseEvent: mouseEvent},  this.props.activeCard, {level: "  "}), 
              React.createElement(Node, React.__spread({mouseEvent: mouseEvent},  this.props.cardCost, {level: "    "})), 
              React.createElement(Node, React.__spread({mouseEvent: mouseEvent},  this.props.cardRules, {level: "    "}))
            )
          )
        )
      )
    )
  }
})

module.exports = CodeView;

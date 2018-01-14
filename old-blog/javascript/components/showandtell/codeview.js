var Node = require("codeview");

var CodeView = React.createClass({
  render: function() {
    var mouseEvent = this.props.mouseEvent;
    return (
      <div>
        <pre>
          // click on a node to view props and other properties."
          <Node mouseEvent={mouseEvent} {...this.props.activeView}>
            <Node mouseEvent={mouseEvent} {...this.props.cardList} level="  ">
              <Node mouseEvent={mouseEvent} {...this.props.card} level="    " />
            </Node>
            <Node mouseEvent={mouseEvent} {...this.props.activeCard} level="  " >
              <Node mouseEvent={mouseEvent} {...this.props.cardCost}  level="    "/>
              <Node mouseEvent={mouseEvent} {...this.props.cardRules} level="    "/>
            </Node>
          </Node>
        </pre>
      </div>
    )
  }
})

module.exports = CodeView;

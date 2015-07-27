var ShowAndTell = React.createClass({displayName: 'ShowAndTell',
  getInitialState: function() {
    return {
      cards: [],
      activeCard: null,
      nodeTree: {
        activeView: { node: "ActiveView", active: false },
        activeCard: { node: "ActiveCard", active: false },
        cardCost: { node: "CardCost", active: false },
        cardRules: { node: "CardRules", active: false },
        cardList: { node: "CardList", active: false },
        card: { node: "Card", active: false }
      },

      propTree: {
        activeView: { node: "ActiveView", active: false },
        activeCard: { node: "ActiveCard", active: false },
        cardCost: { node: "CardCost", active: false },
        cardRules: { node: "CardRules", active: false },
        cardList: { node: "CardList", active: false },
        card: { node: "Card", active: false }
      },

      componentTree: {
        activeView: { node: "ActiveView", active: false },
        activeCard: { node: "ActiveCard", active: false },
        cardCost: { node: "CardCost", active: false },
        cardRules: { node: "CardRules", active: false },
        cardList: { node: "CardList", active: false },
        card: { node: "Card", active: false }
      },

      activeComponent: {}
    }
  },

  handleCardClick: function(index, e) {
    e.preventDefault();
    var cards = this.state.cards;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (i === index) {
        card.isActive = !card.isActive;
      } else {
        card.isActive = false;
      }
    }

    var activeCard = this.state.cards[index];
    this.setState({ cards: cards, activeCard: activeCard });
  },

  componentWillMount: function() {
    $.getJSON("http://mtgjson.com/json/ICE.json", function(res){
      res.cards.forEach(function(card){ card.isActive = false })
      this.setState({ cards: res.cards })
    }.bind(this))
  },

  handleNodeEnter: function(nodePath, activeState, e) {
    var nodeTree = this.state.nodeTree;
    var nodes = Object.keys(nodeTree);

    for (var i = 0; i < nodePath.length; i++) {
      var node = nodePath[i];
      nodeTree[node].active = activeState;
    }

    this.setState({ nodeTree: nodeTree });
  },

  handleComponentFocus: function(node, activeState, e) {
    var componentTree = this.state.componentTree;
    for (var component in componentTree) {
      var comp = componentTree[component];
      if (comp.node === node) {
        comp.active = activeState;
      }
    }

    this.setState({ componentTree: componentTree })
  },

  handleInternals: function(node, e) {
    e.preventDefault();


  },

  render: function() {
    var self = this;
    var componentTree = this.state.componentTree;
    var cardStyle = {
      marginTop: 2,
      backgroundColor: componentTree.card.active ? "#D6D4E4" : ""
    };

    var cards = this.state.cards.map(function(card, index){
      var treePath = ["activeView", "cardList", "card"];
      return React.createElement("li", {
        style: cardStyle, 
        onMouseLeave: self.handleNodeEnter.bind(null, treePath, false), 
        onMouseEnter: self.handleNodeEnter.bind(null, treePath, true), 
        key: index}, 
          React.createElement("a", {onClick: self.handleCardClick.bind(null, index), href: "#"}, card.name)
        )
    })


    return (
      React.createElement("div", {id: "show"}, 
        React.createElement(ActiveView, {
          isActive: componentTree.activeView.active, 
          mouseOver: this.handleNodeEnter}, 
          React.createElement(ActiveCard, React.__spread({
            isActive: componentTree.activeCard.active, 
            cardCost: componentTree.cardCost, 
            cardRules: componentTree.cardRules, 
            mouseOver: this.handleNodeEnter}, 
            this.state.activeCard)
          ), 

          React.createElement(CardList, {
            isActive: componentTree.cardList.active, 
            mouseOver: this.handleNodeEnter, 
            clickCard: this.handleCardClick, 
            cards: this.state.cards
          }, cards
          )
        ), 

        React.createElement(ComponentView, {activeComponent: this.state.activeComponent}, 
          React.createElement(StateObjects, React.__spread({},  this.state)), 
          React.createElement(PropObjects, React.__spread({},  this.props))
        ), 

        React.createElement(CodeView, React.__spread({
          showInternals: this.handleInternals, 
          mouseEvent: this.handleComponentFocus}, 
          this.state.nodeTree)
        )
      )
    )
  }
})

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

var Node = React.createClass({displayName: 'Node',
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
      React.createElement("div", null, 
        React.createElement("div", {style: style}, 
          this.props.level, 
          React.createElement("a", {
            onMouseEnter: mouseEvent.bind(null, this.props.node, true), 
            onMouseLeave: mouseEvent.bind(null, this.props.node, false), 
            onClick: this.preventClick, href: "#"}, 
            beginTag
          )
        ), 
        React.createElement("div", null, 
          children
        ), 
        React.createElement("div", {style: style}, 
          this.props.level, 
          React.createElement("a", {
            onMouseEnter: mouseEvent.bind(null, this.props.node, true), 
            onMouseLeave: mouseEvent.bind(null, this.props.node, false), 
            onClick: this.preventClick, href: "#"}, 
            endTag
          )
        )
      )
    )
  }
})

var ActiveCard = React.createClass({displayName: 'ActiveCard',
  render: function() {
    var nodePath = ["activeView", "activeCard"];
    var enter = this.props.mouseOver.bind(null, nodePath, true);
    var exit = this.props.mouseOver.bind(null, nodePath, false);
    var style = { minHeight: 200, backgroundColor: this.props.isActive ? "#D6D4E4" : "" };
    var cardCost = this.props.cardCost.active;
    var cardRules = this.props.cardRules.active;
    return (
      React.createElement("div", {style: {padding: 10}, onMouseEnter: enter, onMouseLeave: exit, id: "markup", style: style}, 
        React.createElement("h5", {style: {padding: 10}}, this.props.name), 
        React.createElement(CardCost, {active: cardCost, mouseOver: this.props.mouseOver, cost: this.props.manaCost}), 
        React.createElement(CardRules, {active: cardRules, mouseOver: this.props.mouseOver, rules: this.props.text})
      )
    )
  }
})

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

var ActiveView = React.createClass({displayName: 'ActiveView',
  render: function() {
    var treePath = ["activeView"];
    var mouseOver = this.props.mouseOver;
    var style = {
      float: "left",
      width: "50%",
      backgroundColor: this.props.isActive ? "#D6D4E4" : ""
    };

    return (
      React.createElement("div", {
        onMouseEnter: mouseOver.bind(null, treePath, true), 
        onMouseLeave: mouseOver.bind(null, treePath, false), 
        id: "active-view", style: style}, 
        this.props.children
      )
    )
  }
})


// 1. make a card list
// 2. highlight over a card name and show on the right the stuff.

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

function setup(){
  React.render(
    React.createElement(ShowAndTell, null),
    document.getElementById("show-and-tell")
  )
}

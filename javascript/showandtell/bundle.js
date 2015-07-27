(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var ComponentView = React.createClass({displayName: 'ComponentView',
  render: function() {
    return (
      React.createElement("div", null)
    )
  }
})

module.exports = ComponentView;

},{}],5:[function(require,module,exports){
var ShowAndTell = require("./showandtell");
module.exports = function setup() {
  React.render(
    React.createElement(ShowAndTell, null),
    document.getElementById("show-and-tell")
  )
}

},{"./showandtell":8}],6:[function(require,module,exports){

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

module.exports = Node;

},{}],7:[function(require,module,exports){
var PropObjects = React.createClass({displayName: 'PropObjects',
  render: function() {
    return (
      React.createElement("div", null)
    )
  }
})

module.exports = PropObjects;

},{}],8:[function(require,module,exports){
var   CodeView    = require("./node"),
      CardCost    = require("./cardcost"),
      CardList    = require("./cardlist"),
      CardRules   = require("./cardrules"),
      ComponentView = require("./componentview"),
      PropObjects = require("./propobjects"),
      StateObjects = require("./stateobjects"); 



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

module.exports = ShowAndTell;

},{"./cardcost":1,"./cardlist":2,"./cardrules":3,"./componentview":4,"./node":6,"./propobjects":7,"./stateobjects":9}],9:[function(require,module,exports){
var StateObjects = React.createClass({displayName: 'StateObjects',
  render: function() {
    return (
      React.createElement("div", null)
    )
  }
})

module.exports = StateObjects;

},{}]},{},[5]);

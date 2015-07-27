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

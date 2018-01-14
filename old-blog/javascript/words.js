var Magic = React.createClass({displayName: 'Magic',
  getInitialState: function() {
    return { sets: {}, setCodes: [], activeSet: {}, results: [] }
  },

  componentWillMount: function() {
    var sets = [];

    $.getJSON("http://mtgjson.com/json/AllSets.json", function(data){
      var setCodes = [];
      var status = {};

      Object.keys(data).forEach(function(cardSet){
        if (data[cardSet].booster === undefined) {
          delete data[cardSet];
        } else {
          var cards = [];
          var uniqueCards = {};
          data[cardSet].cards.forEach(function(card){
            if (uniqueCards[card.name] === undefined) {
              card.expansion = cardSet;
              uniqueCards[card.name] = card;
              cards.push(card);
            }
          })
          setCodes.push(cardSet);
          status[cardSet] = { highlighted: false, active: false }
          data[cardSet].cards = cards.filter(function(card){ return card.layout !== 'token' })
        }
      })

      this.setState({ sets: data, setCodes: setCodes, status: status })
    }.bind(this))
  },

  setAsActive: function(code) {
    this.setState({
      activeSet: this.state.sets[code]
    })
  },

  searchCard: function(name) {
    var results = [];
    var prevResults = this.state.results;
    var sets = this.state.sets;
    var status = this.state.status;
    var re = new RegExp(name, "i");

    if (name.length === 0) {
      this.state.setCodes.forEach(function(code){
        status[code].highlighted = false;
      })

    } else if (prevResults.length > 0) {
      results = prevResults.filter(function(card){
        status[card.expansion].highlight = false;
        return re.exec(card.name) !== null
      })

      results.forEach(function(card){
        status[card.expansion].highlight = true;
      })
    } else {
      this.state.setCodes.forEach(function(code){
        var cards = sets[code].cards;
        var added = false;
        cards.forEach(function(card){
          var exp = re.exec(card.name);
          if (re.exec(card.name) !== null) {
            results.push(card);
            added = true;
          }
        })
        status[code].highlighted = added;
      })
    }

    this.setState({status: status, results: results})
  },

  render: function() {
    var activeSet = this.state.activeSet;
    var status = this.state.status;
    var detail = activeSet.code === undefined ? React.createElement(ExpansionDetail, {cards: this.state.results}) : React.createElement(ExpansionDetail, React.__spread({},  activeSet))
    var self = this;
    var sets = this.state.setCodes.map(function(set){
      var cardSet = self.state.sets[set];
      var isActive = set === activeSet.code;
      var highlight = status[set].highlighted;

      return (
        React.createElement(ExpansionItem, React.__spread({},  cardSet, {highlight: highlight, active: isActive, makeActive: self.setAsActive}))
      )
    })
    return (
      React.createElement("div", {id: "portal"}, 
        React.createElement(SearchBar, {searchCard: this.searchCard.bind(this)}), 
        React.createElement("div", {id: "set-list"}, 
          sets
        ), 

        React.createElement("div", {id: "active-set"}, 
          detail
        )
      )
    )
  }
})

var SearchBar = React.createClass({displayName: 'SearchBar',
  getInitialState: function() {
    return { categories: ['Sorcery', 'Instant', 'Enchantment', 'Land', 'Artifact', 'Other', 'Creature'] }
  },

  searchParams: function(e) {
    var value = e.target.value;
    this.props.searchCard(value);
  },

  render: function() {

    return (
      React.createElement("div", {id: "search-bar"}, 
        React.createElement("input", {type: "text", defaultValue: "", placeholder: "type card name", onChange: this.searchParams}), 
        React.createElement("input", {type: "checkbox", value: "sorcery"}), 
        React.createElement("input", {type: "checkbox", value: "sorcery"}), 
        React.createElement("input", {type: "checkbox", value: "sorcery"}), 
        React.createElement("input", {type: "checkbox", value: "sorcery"}), 
        React.createElement("input", {type: "checkbox", value: "sorcery"}), 
        React.createElement("input", {type: "checkbox", value: "sorcery"})
      )
    )
  }
})


var ExpansionItem = React.createClass({displayName: 'ExpansionItem',
  getInitialState: function() {
    return {
      cards: [],
      categories:
        {
          'Instant': [],
          'Enchantment': [],
          'Creature': [],
          'Land': [],
          'Sorcery': [],
          'Artifact': [],
          'Other': []
        },
      sorted: false
    }
  },

  componentWillMount: function() {
    if (this.state.sorted) {
      return;
    }

    var cards = this.props.cards;
    var categories = this.state.categories;

    cards.forEach(function(card){
      var type = card.types.join('')
      if (categories[type] === undefined) {
        categories["Other"].push(card);
      } else {
        categories[type].push(card);
      }
    })

    this.setState({ categories: categories, sorted: true })
  },

  showMe: function(e) {
    e.preventDefault();
    var code = this.props.code;
    this.props.makeActive(code);
  },

  render: function() {
    var activeClass = this.props.active ? "active-expansion" : "expansion"
    var display = this.props.highlight ? { display: "block" } : { display: "none" };
    return (
      React.createElement("div", {className: activeClass, style: display}, 
        React.createElement("div", {className: "menu-item"}, 
          React.createElement("a", {href: "#", onClick: this.showMe}, React.createElement("h5", null, this.props.name))
        )
      )
    )
  }
})

var ExpansionDetail = React.createClass({displayName: 'ExpansionDetail',
  getInitialState: function() {
    return { words: {}, cardList: {}, activeCard: {} };
  },

  setCardActive: function(card) {
    this.setState({
      activeCard: card
    })
  },

  render: function() {
    var cardList = this.state.cardList;
    var self = this;
    var activeCard = this.state.activeCard;
    var cardElem;

    if (activeCard.name === undefined) {
      cardElem = "";
    } else {
      cardElem = React.createElement(CardDetail, React.__spread({},  activeCard))
    }

    var cards = this.props.cards.map(function(card){
      var activeClass = card.multiverseid === activeCard.multiverseid ? "active-card" : "card";
      return (
        React.createElement(Card, React.__spread({},  card, {active: activeClass, setActive: self.setCardActive}))
      )
    })

    return (
      React.createElement("div", {id: "expansion-cards"}, 
        React.createElement("div", {id: "card-list"}, 
          cards
        ), 

        React.createElement("div", {id: "card-spotlight"}, 
          cardElem
        )
      )
    )
  }
})

var Card = React.createClass({displayName: 'Card',
  getInitialState: function() {
    return { checked: false, active: false }
  },

  showCard: function(e) {
    e.preventDefault();
    var card = this.props;
    this.props.setActive(card);
  },

  render: function() {
    return (
      React.createElement("div", {className: this.props.active}, 
        React.createElement("a", {href: "#", onClick: this.showCard}, React.createElement("h5", null, this.props.name))
      )
    )
  }
})

var CardTypes = React.createClass({displayName: 'CardTypes',
  getInitialState: function() {
    return { types: {} }
  },

  componentWillMount: function() {

  },

  render: function() {
    return (
      React.createElement("div", {className: "category"}, 
        React.createElement("a", {href: "#"}, React.createElement("h5", null, this.props.type))
      )
    )
  }
})

var CardDetail = React.createClass({displayName: 'CardDetail',
  render: function() {
    return (
      React.createElement("div", {id: "card-detail"}, 
        React.createElement("div", {id: "picture"}, 
          React.createElement("img", {src: "http://mtgimage.com/multiverseid/" + this.props.multiverseid + ".jpg", height: "300", width: "175"})
        ), 

        React.createElement("div", {className: "text"}, 
          this.props.text
        )
      )
    )
  }
})

function renderMagic () {
  React.render(React.createElement(Magic, null), document.getElementById('magic'))
}

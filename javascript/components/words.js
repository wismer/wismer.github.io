var Magic = React.createClass({
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
    var detail = activeSet.code === undefined ? <ExpansionDetail cards={this.state.results} /> : <ExpansionDetail {...activeSet} />
    var self = this;
    var sets = this.state.setCodes.map(function(set){
      var cardSet = self.state.sets[set];
      var isActive = set === activeSet.code;
      var highlight = status[set].highlighted;

      return (
        <ExpansionItem {...cardSet} highlight={highlight} active={isActive} makeActive={self.setAsActive} />
      )
    })
    return (
      <div id='portal'>
        <SearchBar searchCard={this.searchCard.bind(this)} />
        <div id='set-list'>
          {sets}
        </div>

        <div id='active-set'>
          {detail}
        </div>
      </div>
    )
  }
})

var SearchBar = React.createClass({
  getInitialState: function() {
    return { categories: ['Sorcery', 'Instant', 'Enchantment', 'Land', 'Artifact', 'Other', 'Creature'] }
  },

  searchParams: function(e) {
    var value = e.target.value;
    this.props.searchCard(value);
  },

  render: function() {

    return (
      <div id='search-bar'>
        <input type='text' defaultValue="" placeholder='type card name' onChange={this.searchParams}></input>
        <input type='checkbox' value='sorcery'></input>
        <input type='checkbox' value='sorcery'></input>
        <input type='checkbox' value='sorcery'></input>
        <input type='checkbox' value='sorcery'></input>
        <input type='checkbox' value='sorcery'></input>
        <input type='checkbox' value='sorcery'></input>
      </div>
    )
  }
})


var ExpansionItem = React.createClass({
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
      <div className={activeClass} style={display}>
        <div className='menu-item'>
          <a href='#' onClick={this.showMe}><h5>{this.props.name}</h5></a>
        </div>
      </div>
    )
  }
})

var ExpansionDetail = React.createClass({
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
      cardElem = <CardDetail {...activeCard} />
    }

    var cards = this.props.cards.map(function(card){
      var activeClass = card.multiverseid === activeCard.multiverseid ? "active-card" : "card";
      return (
        <Card {...card} active={activeClass} setActive={self.setCardActive} />
      )
    })

    return (
      <div id='expansion-cards'>
        <div id='card-list'>
          {cards}
        </div>

        <div id='card-spotlight'>
          {cardElem}
        </div>
      </div>
    )
  }
})

var Card = React.createClass({
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
      <div className={this.props.active} >
        <a href='#' onClick={this.showCard}><h5>{this.props.name}</h5></a>
      </div>
    )
  }
})

var CardTypes = React.createClass({
  getInitialState: function() {
    return { types: {} }
  },

  componentWillMount: function() {

  },

  render: function() {
    return (
      <div className='category'>
        <a href='#'><h5>{this.props.type}</h5></a>
      </div>
    )
  }
})

var CardDetail = React.createClass({
  render: function() {
    return (
      <div id='card-detail'>
        <div id='picture'>
          <img src={"http://mtgimage.com/multiverseid/" + this.props.multiverseid + ".jpg"} height='300' width ='175'/>
        </div>

        <div className='text'>
          {this.props.text}
        </div>
      </div>
    )
  }
})

function renderMagic () {
  React.render(<Magic />, document.getElementById('magic'))
}

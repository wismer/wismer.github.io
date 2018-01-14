var Magic = React.createClass({
  getInitialState: function() {
    return { cardPool: [], selectedCards: [{ name: "Click and drag the card name to the other column"}] };
  },

  componentWillMount: function()  {
    $.getJSON("http://mtgjson.com/json/5ED.json", function(set){
      this.setState({ cardPool: set.cards })
    }.bind(this))
  },

  handleMoveCard: function(card, side, e) {
    var selectedCards = this.state.selectedCards;
    var cardPool = this.state.cardPool;

    if (side === "selected") {
      selectedCards = selectedCards.filter(function(c){
        return c.name !== card.name;
      })

      cardPool.push(card);
    } else {
      cardPool = cardPool.filter(function(c){
        return c.name !== card.name;
      })

      selectedCards.push(card);
    }

    this.setState({ cardPool: cardPool, selectedCards: selectedCards })
  },

  handleMoveStart: function(card, side, e) {
    
  },

  handleDragEnd: function(card, side, e) {
  },

  handleMoveOver: function(card, side, e) {
    e.preventDefault();
  },

  render: function() {
    return (
      <div id='card-view'>
        <CardPool
          moveOver={this.handleMoveOver}
          moveStart={this.handleMoveStart}
          moveCard={this.handleMoveCard}
          dragEnd={this.handleDragEnd}
          cards={this.state.cardPool}
          pool='unselected'
        />
        <CardPool
          draggable="true"
          moveOver={this.handleMoveOver}
          moveStart={this.handleMoveStart}
          moveCard={this.handleMoveCard}
          dragEnd={this.handleDragEnd}
          cards={this.state.selectedCards}
          pool='selected'
        />
      </div>
    )
  }
})

var CardPool = React.createClass({
  render: function() {
    var pool = this.props.pool;
    var self = this;

    var cards = this.props.cards.map(function(card){
      return (
        <div
          draggable="true"
          onDrop={self.props.moveCard.bind(null, card, pool)}
          onDragStart={self.props.moveStart.bind(null, card, pool)}
          onDragEnd={self.props.dragEnd.bind(null, card, pool)}
          onDragOver={self.props.moveOver.bind(null, card, pool)}
        >
          {card.name}
        </div>
      )
    })

    var style = {
      float: pool === 'unselected' ? "left" : "right",
      width: 250,
      minHeight: 150,
      border: "1px solid black"
    };

    return (
      <div id={this.props.pool} style={style}>
        {cards}
      </div>
    )
  }
})

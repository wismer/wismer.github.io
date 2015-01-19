var MagneticWords = React.createClass({displayName: 'MagneticWords',
  getInitialState: function() {
    return {
      tweets: [],
      activeWords: [],
      step: 0
    }
  },

  componentWillMount: function() {
    var tweets = this.state.tweets;
    $.getJSON("/external/tweet.json", function(t){
      tweets = t.tweets.map(function(tweet, index){
        return { index: index, tweet: tweet };
      })
      tweets = tweets.concat(t.tweets);
      this.setState({ tweets: tweets })
    }.bind(this))
  },

  componentDidMount: function() {

  },

  render: function() {

    return (
      React.createElement(WordShowcase, null, 
        React.createElement(WordTowers, null), 
        React.createElement(ActiveWords, null), 
        React.createElement(Sentence, null)
      )
    )
  }
})

function renderWords() {
  React.render(
    React.createElement(MagneticWords, null),
    document.getElementById("magnetic-words")
  )
}
var MagneticWords = React.createClass({
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
      <WordShowcase>
        <WordTowers />
        <ActiveWords />
        <Sentence />
      </WordShowcase>
    )
  }
})

function renderWords() {
  React.render(
    <MagneticWords />,
    document.getElementById("magnetic-words")
  )
}
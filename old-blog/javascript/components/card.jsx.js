var fonts = [
  "'Yellowtail', cursive",
  "'Fauna One', serif",
  "'Droid Sans Mono'",
  "'Kreon', serif",
  "'PT Serif', serif",
  "'Monda', sans-serif",
  "'Libre Baskerville', serif",
  "'Alegreya Sans', sans-serif",
  "'Ubuntu Condensed', sans-serif",
  "'Yanone Kaffeesatz', sans-serif",
  "'Audiowide', cursive",
  "'Amaranth', sans-serif",
  "'Damion', cursive"
]

var TypeForm = React.createClass({
  getInitialState: function() {
    return { letters: [] }
  },

  showOff: function(e) {
    var text = e.target.value.split("");
    var letters = this.state.letters;
    var i = Math.floor((Math.random() * fonts.length))
    var lastLetter = text[text.length - 1];

    if (text.length < letters.length) {
      letters.pop();
    } else {
      letters.push({character: lastLetter, font: fonts[i]})
    }

    this.setState({
      letters: letters
    })
  },

  render: function() {
    var letters = this.state.letters.map(function(letter){
      return (
        <span style={{fontFamily: letter.font}}>{letter.character}</span>
      )
    })

    return (
      <div>
        <div className="input" style={{float: "left"}}>
          <textarea rows='20' cols='25' type="text" onInput={this.showOff}></textarea>
        </div>
        <div className="output" style={{float: "right", letterSpacing: '1em', fontSize: '1.25em'}}>
          <p>{letters}</p>
        </div>
      </div>
    )
  }
})

var LetterBox = React.createClass({

  render: function() {
    return (
      <span style={{fontFamily: this.props.letter}}>{this.props.character}</span>
    )
  }
})



var renderTyper = function() {
  React.render(
    <TypeForm />,
    document.getElementById("magic-cards")
  )
}


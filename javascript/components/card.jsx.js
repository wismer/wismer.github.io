var Card = React.createClass({
  render: function() {
    return (
      <div id="card">
        <CardTemplate />
      </div>
    )
  }
})

var CardTemplate = React.createClass({
  render: function() {
    return ( <img src="/images/magic-card-template.png" height="300" width="175"></img> )
  }
})


var TypeForm = React.createClass({
  getInitialState: function() {

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

    return { value: "", countTimes: 1, fontStyles: fonts }
  },

  showOff: function(e) {
    var countTimes = this.state.countTimes
    this.setState({
      value: e.target.value,
      countTimes: countTimes + 1
    })
  },

  render: function() {
    var fonts = this.state.fontStyles
    var letters = this.state.value.split("").map(function(letter){
      var i = Math.floor((Math.random() * 3))
      return (
        <span style={{fontFamily: fonts[i]}}>{letter}</span>
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

var renderTyper = function() {
  React.render(
    <TypeForm />,
    document.getElementById("magic-cards")
  )
}

var renderCard = function() {
  React.render(
    <Card />,
    document.getElementById("magic-cards")
  )
}

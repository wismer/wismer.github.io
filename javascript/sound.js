// oscilattor
// feed frequency to cascade component
// onended event - clear intervals

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var request = new XMLHttpRequest();
var song = document.querySelector("audio");

// song.onplay = function(e) {
//   request.open("GET", "/external/test.ogg", true);
//   request.responseType = 'arraybuffer';
//   request.onload = function() {
//     context.decodeAudioData(request.response, function(buffer) {
//       var source = context.createBufferSource();
//       var analyser = context.createAnalyser();
//       source.buffer = buffer;
//       source.connect(analyser);
//       source.start(0);
//       analyser.fftSize = 128;
//       React.render(
//         <Cascade analyser={analyser} />,
//         document.getElementById("analyser")
//       )
//     })
//   }
//   request.send();

request.open("GET", "/external/test.ogg", true);
request.responseType = 'arraybuffer';
request.onload = function() {
  context.decodeAudioData(request.response, function(buffer) {
    song.onplay = function(e) {
      var source = context.createBufferSource();
      var analyser = context.createAnalyser();
      source.buffer = buffer;
      source.connect(analyser);
      source.connect(context.destination)
      source.start(0);
      analyser.fftSize = 128;
      React.render(
        React.createElement(Cascade, {analyser: analyser}),
        document.getElementById("analyser")
      )
    }
  })
}


request.send();

var Cascade = React.createClass({displayName: 'Cascade',
  getInitialState: function() {
    var rows = [];

    for (var i = 0; i < 128; i++) {
      rows[i] = { level: 0, max: 0 };
    }
    return {
      decibel: 0,
      record: rows
    }
  },

  componentWillMount: function() {
    setInterval(this.measure, 50)
  },

  measure: function() {
    var analyser = this.props.analyser;
    var array = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(array);
    var records = this.state.record;

    for (var i = 0; i < array.length; i++) {
      var prevDec = records[i];
      var currentDec = (array[i] + 140) > 0 ? array[i] + 140 : 0;
      prevDec.level = currentDec;
      if (currentDec < (prevDec.max - 10)) {
        // find the difference between the current reading and the previous "max"
        // and then halve it. Let that represent the new position of max.
        prevDec.max -= (prevDec.max - currentDec) / 2;
      } else if (currentDec > prevDec.max) {
        prevDec.max = currentDec;
      }

      records[i] = prevDec;
    }
    this.setState({ record: records })
  },

  render: function() {
    var renderRows = this.state.record.map(function(row, i){
      return React.createElement(Row, React.__spread({},  row, {key: i}))
    })

    return (
      React.createElement("div", {id: "boxes"}, 
        renderRows
      )
    )
  }
})

var Row = React.createClass({displayName: 'Row',
  render: function() {
    var decibel = this.props.level;
    var maxBox = React.createElement("div", {style: {width: 10, height: 5, backgroundColor: "red", marginTop: this.props.max}, className: "max-box"})
    return (
      React.createElement("div", {style: {width: 10, marginRight: 1, float: "left", height: decibel + 1, backgroundColor: "black"}, className: "row"}, 
        maxBox
      )
    )
  }
})
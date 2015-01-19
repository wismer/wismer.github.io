var dataSet = [];
var limit = 100;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var generateData = function() {
  var instance = [];
  // transitionUp -> from x to y
  // maxExtent -> y
  // transitionDown -> from y to x
  var prevState = 0;
  for (var i = 0; i < 100; i++) {
    var set = { prevState: prevState };
    var likelihood = limit - prevState // if it was 30, it's now 70
    var randomNum = Math.floor(Math.random() * limit);
    var range = (prevState / 10) + 1;

    if (likelihood > randomNum) {
      // goes up
      prevState += range;
    } else {
      // goes down
      prevState -= range;
    }

    set.extent = prevState;
    instance.push(set);
  }

  dataSet.push(instance);
};

var stroke = function(x,y) {

}

stroke({x: [0,25], y: []});

var letters = {
  A: [{  }],
  B: [],
  C: [],
  D: [],

}

var Graph = React.createClass({displayName: 'Graph',
  getInitialState: function() {
    return { currentStep: 0 };
  },

  componentDidMount: function() {
    setInterval(this.handleUpdateRows, 200);
  },

  handleUpdateRows: function() {
    var currentStep = this.state.currentStep + 1;
    this.setState({ currentStep: currentStep })
  },

  render: function() {
    var currentStep = this.state.currentStep;
    // 0 is the initial step
    var sets = this.props.data.map(function(set, index){
      // the step is passed over to the column
      return (
        React.createElement(Column, {set: set, step: currentStep, index: index})
      )
    })


    return (
      React.createElement("div", {id: "graph"}, 
        sets
      )
    )
  }
})

// 100 steps
// 100 * 100 cubes
// each step informs the column how many boxes become active
// need a better way to handle updating the boxes.

var Column = React.createClass({displayName: 'Column',
  render: function() {
    var step = this.props.step;
    var activeBox = this.props.set[step];
    var number = Math.random() * 10;
    var active = number > 4 ? "column" : "column column-active";
    var height = number * 200;

    var style = {
      transition: "height 0.5 ease-in",
      height: height + "px"
    }

    return (
      React.createElement("div", {className: active, style: style})
    )
  }
})

// var Box = React.createClass({
//   getInitialState: function() {
//     return { current: 0 }
//   },

//   handleUpdateRows: function() {
//     var current = this.state.current + 1;
//     this.setState({ current: current })
//   },

//   componentDidMount: function() {
//     setInterval(this.handleUpdateRows, 1000)
//   },

//   render: function() {
//     return (

//     )
//   }
// })

var generateGraph = function() {
  for (var i = 0; i < limit; i++) {
    generateData();
  }


  React.render(
    React.createElement(Graph, {data: dataSet}),
    document.getElementById("graph-table")
  )
}

// starts at 0
// guaranteed to go up
// the range it could go up to is 1 - 100, but the lower number is more likely...how to figure that?
// the lower half is more likely... so, 1-50 is weighted more heavily

// starts: 30
// 70% chance up
// if down, decreases by (difference / 10) -> 30 / 10 -> 30 - 3 -> goes to 27
// if up, increases by (difference / 10) -> 30 + (30 / 3) -> goes to 31 to 33?

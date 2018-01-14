(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Component = React.createClass({displayName: 'Component',
  render: function() {
    return (
      React.createElement("div", null)
    )
  }
})

module.exports = Component;

},{}],2:[function(require,module,exports){
var ComponentWillReceive = React.createClass({displayName: 'ComponentWillReceive',
  render: function() {
    return React.createElement("div", null)
  }
})

module.exports = ComponentWillReceive;

},{}],3:[function(require,module,exports){
var ComponentStages = React.createClass({displayName: 'ComponentStages',
  render: function() {
    return React.createElement("div", null, this.props.children)
  }
})

module.exports = ComponentStages;

},{}],4:[function(require,module,exports){
var ComponentWillMount = React.createClass({displayName: 'ComponentWillMount',
  render: function() {
    return React.createElement("div", null)
  }
})

module.exports = ComponentWillMount;

},{}],5:[function(require,module,exports){
var DataLoading = React.createClass({displayName: 'DataLoading',
  render: function() {
    return React.createElement("div", null)
  }
})

module.exports = DataLoading;

},{}],6:[function(require,module,exports){
var DidMount = React.createClass({displayName: 'DidMount',
  render: function() {
    return React.createElement("div", null)
  }
})

module.exports = DidMount;

},{}],7:[function(require,module,exports){
var JustMounted = React.createClass({displayName: 'JustMounted',
  render: function() {
    return React.createElement("div", null)
  }
})

module.exports = JustMounted;

},{}],8:[function(require,module,exports){
var ComponentStages    = require('./componentstages.js'),
    NotYetMounted      = require('./notyetmounted.js'),
    DataLoading        = require('./dataloading.js'),
    ComponentWillMount = require('./componentwillmount.js'),
    JustMounted        = require('./justmounted.js'),
    DidMount           = require('./didmount.js'),
    ComponentWillReceiveProps = require('./componentrcv.js'),
    ShouldComponentUpdate = require('./shouldcomponent.js'),
    RenderStage        = require('./renderstage.js'),
    Component          = require('./component.js');

var LifeCycle = React.createClass({displayName: 'LifeCycle',
  getInitialState: function() {
    return {

    }
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(ComponentStages, null, 
          React.createElement(NotYetMounted, null, 
            React.createElement(DataLoading, null), 
            React.createElement(ComponentWillMount, null)
          ), 

          React.createElement(JustMounted, null, 
            React.createElement(DidMount, null), 
            React.createElement(ComponentWillReceiveProps, null), 
            React.createElement(ShouldComponentUpdate, null)
          ), 

          React.createElement(RenderStage, null, 
            React.createElement(Component, null)
          )
        )
      )
    )
  }
})

module.exports = LifeCycle;

},{"./component.js":1,"./componentrcv.js":2,"./componentstages.js":3,"./componentwillmount.js":4,"./dataloading.js":5,"./didmount.js":6,"./justmounted.js":7,"./notyetmounted.js":10,"./renderstage.js":11,"./shouldcomponent.js":12}],9:[function(require,module,exports){
var LifeCycle = require("./lifecycle.js");
React.render(
  React.createElement(LifeCycle, null),
  document.getElementById("show-and-tell")
)

},{"./lifecycle.js":8}],10:[function(require,module,exports){
var NotYetMounted = React.createClass({displayName: 'NotYetMounted',
  render: function() {
    return React.createElement("div", null, this.props.children)
  }
})

module.exports = NotYetMounted;

},{}],11:[function(require,module,exports){
var RenderStage = React.createClass({displayName: 'RenderStage',
  render: function() {
    return React.createElement("div", null)
  }
})

module.exports = RenderStage;

},{}],12:[function(require,module,exports){
var ShouldComponentUpdate = React.createClass({displayName: 'ShouldComponentUpdate',
  render: function() {
    return React.createElement("div", null)
  }
})

module.exports = ShouldComponentUpdate;

},{}]},{},[9]);

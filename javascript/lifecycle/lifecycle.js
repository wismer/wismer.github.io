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
      stages: {
        notYetMounted: {
          dataLoad: false,
          componentWillMount: false
        },

        justMounted: {
          didMount: false,
          componentWillReceiveProps: false,
          shouldComponentUpdate: false
        }
      }
    }
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Viewer, null

        ), 
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

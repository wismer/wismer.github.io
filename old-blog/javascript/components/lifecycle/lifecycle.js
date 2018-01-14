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

var LifeCycle = React.createClass({
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
      <div>
        <Viewer>

        </Viewer>
        <ComponentStages>
          <NotYetMounted>
            <DataLoading />
            <ComponentWillMount />
          </NotYetMounted>

          <JustMounted>
            <DidMount />
            <ComponentWillReceiveProps />
            <ShouldComponentUpdate />
          </JustMounted>

          <RenderStage>
            <Component />
          </RenderStage>
        </ComponentStages>
      </div>
    )
  }
})

module.exports = LifeCycle;

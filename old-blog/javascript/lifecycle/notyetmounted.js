var NotYetMounted = React.createClass({displayName: 'NotYetMounted',
  render: function() {
    return React.createElement("div", null, this.props.children)
  }
})

module.exports = NotYetMounted;

// jshint unused:true, esnext:true, expr:true
const LIST = [
  'Charlemange',
  'Charles the Great',
  'Charlie Chaplin',
  'Chasten',
  'Christie',
  'Card',
  'Miserly',
  'Pencil',
  'Ark',
  'Tomatoe',
  'Head',
  'Phone',
  'Piece',
  'Code',
  'Coke',
  'Coda',
  'Ball',
  'Balloon',
  'Belle',
  'Bufort',
  'McClellan',
  'McCoy',
  'Morose',
  'Tangible',
  'Purile',
  'Micro'
];

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;



var FilterPost = React.createClass({displayName: "FilterPost",
  getInitialState: function() {
    var words = LIST.map((word)=>{
      return { name: word, highlighted: '', fragmented: word };
    });

    return { active: false, words: words, q: '', endAnimation: false };
  },

  end() {
    this.setState({ endAnimation: !this.state.endAnimation });
  },

  toggleList() {
    this.setState({ active: !this.state.active });
  },

  filterWords(e) {
    var words = this.state.words.map((word)=>{
      var re = new RegExp(`^${e.target.value}`, 'i');
      var highlighted = word.name.match(re);
      if (this.state.q === '') {
        word.highlighted = '';
        word.fragmented = '';
      } else if (highlighted) {
        word.highlighted = highlighted[0];
        word.fragmented = word.name.replace(word.highlighted, '');
      } else {
        word.highlighted = '';
        word.fragmented = word.name;
      }
      return word;
    });

    this.setState({ words: words, q: e.target.value });
  },

  render: function() {
    var self = this;
    function toMarkup(word, idx) {
      return React.createElement(Word, React.__spread({},  word, {endPhase: self.state.endAnimation, transitionend: self.end, key: idx}));
    }

    var unmatchedWords = [];
    var matchedWords = [];

    this.state.words.forEach((word)=>{
      if (word.highlighted.length > 0 || this.state.q === '') {
        matchedWords.push(word);
      } else {
        unmatchedWords.push(word);
      }
    });

    // file structure navigation


    // <input type='button' onClick={this.toggleList} value='toggle list'></input>

    return (
      React.createElement("div", {className: "filter-list container"}, 
        React.createElement("div", {className: "control-panel"}, 
          React.createElement("input", {type: "text", onChange: this.filterWords, defaultValue: ""})
        ), 
        React.createElement("section", {className: "matched"}, 
          React.createElement(ReactCSSTransitionGroup, {transitionend: this.end, transitionName: "match", transitionAppear: true}, 
            matchedWords.map(toMarkup)
          )
        ), 
        React.createElement("div", {className: "bridge"}), 
        React.createElement("section", {className: "not-matched"}, 
          React.createElement(ReactCSSTransitionGroup, {transitionend: this.end, transitionName: "not-match", transitionAppear: true}, 
            unmatchedWords.map(toMarkup)
          )
        )
      )
    );
  }
});

var Word = React.createClass({displayName: "Word",
  componentDidMount() {
    var ref = this.refs.divMe.getDOMNode();
    ref.addEventListener('transitionend', (e)=> {
      if (e.currentTarget.className.includes('leave')) {
        this.props.transitionend();
      }
    });
  },

  render: function() {
    var name = this.props.highlighted.length > 0 ? this.props.fragmented : this.props.name;
    return (
      React.createElement("div", {className: "word-name", onTransitionEnd: this.fuck, ref: "divMe"}, 
        React.createElement("strong", null, this.props.highlighted), React.createElement("span", null, name)
      )
    );
  }
});


React.render(
  React.createElement(FilterPost, null),
  document.getElementById('select-list')
);

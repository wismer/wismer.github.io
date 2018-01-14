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



var FilterPost = React.createClass({
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
      return <Word {...word} endPhase={self.state.endAnimation} transitionend={self.end} key={idx} />;
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
      <div className='filter-list container'>
        <div className='control-panel'>
          <input type='text' onChange={this.filterWords} defaultValue=''></input>
        </div>
        <section className='matched'>
          <ReactCSSTransitionGroup transitionend={this.end} transitionName='match' transitionAppear={true}>
            {matchedWords.map(toMarkup)}
          </ReactCSSTransitionGroup>
        </section>
        <div className='bridge'></div>
        <section className='not-matched'>
          <ReactCSSTransitionGroup transitionend={this.end} transitionName='not-match' transitionAppear={true}>
            {unmatchedWords.map(toMarkup)}
          </ReactCSSTransitionGroup>
        </section>
      </div>
    );
  }
});

var Word = React.createClass({
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
      <div className='word-name' onTransitionEnd={this.fuck} ref='divMe'>
        <strong>{this.props.highlighted}</strong><span>{name}</span>
      </div>
    );
  }
});


React.render(
  <FilterPost />,
  document.getElementById('select-list')
);

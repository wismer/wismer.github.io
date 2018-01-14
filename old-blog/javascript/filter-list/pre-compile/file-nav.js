// jshint unused:true, esnext:true, expr:true
const DIR = [
  {
    root: '/', folder: true, contents: [
      {
        root: '/js/', folder: true, contents: [
          { root: 'react.js', folder: false, contents: [] },
          { root: 'pre-compile', folder: true, contents: [] }
        ]
      }
    ]
  }
];

const CATEGORIES = ['Battlecry', 'Secret', 'Stealth', 'Aura', 'Enrage', 'Deathrattle', 'Combo', 'Divine Shield', 'Taunt'];

var CodeWalk = React.createClass({
  render() {
    return (
      <div>
      </div>
    );
  }
});


var FileNavigation = React.createClass({
  getInitialState() {
    return {
      q: '',
      list: [],
      cachedResults: [],
      pageResults: [],
      paginate: 20,
      page: 1,
      pages: 0,
      activeCard: {},
      byName: false,
      byCategory: false
    };
  },

  componentDidMount() {
    $.getJSON("/javascript/filter-list/classic.json", (list)=>{
      var categories = [];
      list.forEach((card)=>{
        if (card.mechanics) {
          categories = categories.concat(card.mechanics);
        }
      });

      this.setState({
        categories: categories,
        list: list,
        pages: Math.floor((list.length / 20) + 1),
        cachedResults: list,
        pageResults: list.slice(0, 20)
      });
    });
  },

  refreshResults(pageVal, action, e) {
    var page = this.state.page + pageVal;
    var cachedResults = this.state.cachedResults,
        pageResults, pages;

    if (action !== 'query') {
      pageResults = this.state.cachedResults.slice((page - 1) * 20, page * 20);
      pages = Math.floor(this.state.cachedResults.length / 20) + 1;
      this.setState({ pageResults: pageResults, page: page, pages: pages });
      return;
    }

    var query = e.target.value;

    if (query === '') {
      cachedResults = this.state.list;
      pages = Math.floor(this.state.list.length / 20) + 1;
      this.setState({
        pages: pages,
        page: 1,
        pageResults: cachedResults.slice(0, 20),
        q: query,
        cachedResults: cachedResults
      });
      return;
    }

    var cardFilter = (card) => card.name.toLowerCase().includes(query);
    if (query.includes(this.state.q) && this.state.q !== '') {
      cachedResults = this.state.cachedResults.filter(cardFilter);
    } else {
      cachedResults = this.state.list.filter(cardFilter);
    }

    page = 1;
    pages = Math.floor(cachedResults.length / 20) + 1;
    pageResults = cachedResults.slice(0, 20);

    this.setState({
      pageResults: pageResults,
      cachedResults: cachedResults,
      q: query,
      pages: pages,
      page: page
    });
  },

  handleHighlight(card, isActive) {
    if (isActive) {
      this.setState({ activeCard: card });
    } else {
      this.setState({ activeCard: {} });
    }
  },

  toggleSearch(type) {
    if (type === 'byName') {
      this.setState({ byName: true, byCategory: false });
    } else {
      this.setState({ byName: false, byCategory: true });
    }
  },

  render() {
    var results = this.state.pageResults.filter((card)=>{
      return card.name.toLowerCase().includes(this.state.q);
    }).map((card, idx)=>{
      card.active = card.id === this.state.activeCard.id;
      return (
        <Card {...card} key={idx} handleHighlight={this.handleHighlight} />
      );
    });
    var page = this.state.page;
    var pages = this.state.pages;
    var activeCard = this.state.activeCard;
    var showcased;
    if (activeCard.id) {
      showcased = <Showcase {...activeCard} />;
    } else {
      showcased = '';
    }

    var pictures = {
      img: this.state.pageResults.map((card, idx)=>{
        var id = card.id.toLowerCase().replace(/\D$/i, '');
        var src = `/images/classic_${id}.png`;
        return <img src={src} key={idx} />;
      }),
      style: { display: 'none' }
    };

    var style = {
      name: { display: this.state.byName ? 'block' : 'none' },
      category: { display: this.state.byCategory ? 'block' : 'none' }
    };

    return (
      <div className='file-nav container'>
        <div style={pictures.style} className='pictures'>
          {pictures.img}
        </div>

        <section>
          <input name='search' onChange={this.toggleSearch.bind(this, 'byName')} type='radio'>name</input>
          <br></br>
          <input name='search' onChange={this.toggleSearch.bind(this, 'byCategory')} type='radio'>category</input>
        </section>

        <section style={style.name} className='panel'>
          <input onChange={this.refreshResults.bind(this, 0, 'query')} type='text' defaultValue=''></input>
          <div classNamed='paginate'>
            <input onClick={this.refreshResults.bind(this, -1, 'prev')} disabled={page === 1} type='button' value='prev'></input>
            <div className='page-gap'>{this.state.page} of {this.state.pages}</div>
            <input onClick={this.refreshResults.bind(this, 1, 'next')} disabled={page === pages} type='button' value='next'></input>
          </div>
        </section>

        <section style={style.byCategory}>
          <Category />
        </section>
        <div className='row' style={style.name}>
          <div className='results-page col-md-3'>
            {results}
          </div>

          <div className='row'>
            {showcased}
          </div>
        </div>
      </div>
    );
  }
});

var Category = React.createClass({
  what() {
    debugger
  },

  render() {
    return (
      <div onKeyPress={this.what} className='category'>

      </div>
    );
  }
});

var Card = React.createClass({
  onHighlight(isActive) {
    this.props.handleHighlight(this.props, isActive);
  },

  render() {
    var className = this.props.active ? 'card-name active' : 'card-name';
    return (
      <div onMouseEnter={this.onHighlight.bind(this, true)} onMouseLeave={this.onHighlight.bind(this, false)} key={this.props.key}>
        <div className={className}>{this.props.name}</div>
        <input onSelect={this.onHighlight.bind(this, true)} className='input-tab' type='text' value={this.props.id} tabIndex={this.props.key}></input>
      </div>
    );
  }
});

var Showcase = React.createClass({
  render() {
    var src = this.props.id.toLowerCase().replace(/\D$/, '');
    return (
      <div className='highlight-text col-md-3'>
        <img src={`/images/classic_${src}.png`} />
      </div>
    );
  }
});

React.render(
  <FileNavigation directory={DIR} />,
  document.getElementById('file-nav')
);

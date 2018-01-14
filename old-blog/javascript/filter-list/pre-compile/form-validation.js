// jshint unused:true, esnext:true, expr:true
const STATES = [
    {
        "name": "Alabama",
        "code": "AL"
    },
    {
        "name": "Alaska",
        "code": "AK"
    },
    {
        "name": "American Samoa",
        "code": "AS"
    },
    {
        "name": "Arizona",
        "code": "AZ"
    },
    {
        "name": "Arkansas",
        "code": "AR"
    },
    {
        "name": "California",
        "code": "CA"
    },
    {
        "name": "Colorado",
        "code": "CO"
    },
    {
        "name": "Connecticut",
        "code": "CT"
    },
    {
        "name": "Delaware",
        "code": "DE"
    },
    {
        "name": "District Of Columbia",
        "code": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "code": "FM"
    },
    {
        "name": "Florida",
        "code": "FL"
    },
    {
        "name": "Georgia",
        "code": "GA"
    },
    {
        "name": "Guam",
        "code": "GU"
    },
    {
        "name": "Hawaii",
        "code": "HI"
    },
    {
        "name": "Idaho",
        "code": "ID"
    },
    {
        "name": "Illinois",
        "code": "IL"
    },
    {
        "name": "Indiana",
        "code": "IN"
    },
    {
        "name": "Iowa",
        "code": "IA"
    },
    {
        "name": "Kansas",
        "code": "KS"
    },
    {
        "name": "Kentucky",
        "code": "KY"
    },
    {
        "name": "Louisiana",
        "code": "LA"
    },
    {
        "name": "Maine",
        "code": "ME"
    },
    {
        "name": "Marshall Islands",
        "code": "MH"
    },
    {
        "name": "Maryland",
        "code": "MD"
    },
    {
        "name": "Massachusetts",
        "code": "MA"
    },
    {
        "name": "Michigan",
        "code": "MI"
    },
    {
        "name": "Minnesota",
        "code": "MN"
    },
    {
        "name": "Mississippi",
        "code": "MS"
    },
    {
        "name": "Missouri",
        "code": "MO"
    },
    {
        "name": "Montana",
        "code": "MT"
    },
    {
        "name": "Nebraska",
        "code": "NE"
    },
    {
        "name": "Nevada",
        "code": "NV"
    },
    {
        "name": "New Hampshire",
        "code": "NH"
    },
    {
        "name": "New Jersey",
        "code": "NJ"
    },
    {
        "name": "New Mexico",
        "code": "NM"
    },
    {
        "name": "New York",
        "code": "NY"
    },
    {
        "name": "North Carolina",
        "code": "NC"
    },
    {
        "name": "North Dakota",
        "code": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "code": "MP"
    },
    {
        "name": "Ohio",
        "code": "OH"
    },
    {
        "name": "Oklahoma",
        "code": "OK"
    },
    {
        "name": "Oregon",
        "code": "OR"
    },
    {
        "name": "Palau",
        "code": "PW"
    },
    {
        "name": "Pennsylvania",
        "code": "PA"
    },
    {
        "name": "Puerto Rico",
        "code": "PR"
    },
    {
        "name": "Rhode Island",
        "code": "RI"
    },
    {
        "name": "South Carolina",
        "code": "SC"
    },
    {
        "name": "South Dakota",
        "code": "SD"
    },
    {
        "name": "Tennessee",
        "code": "TN"
    },
    {
        "name": "Texas",
        "code": "TX"
    },
    {
        "name": "Utah",
        "code": "UT"
    },
    {
        "name": "Vermont",
        "code": "VT"
    },
    {
        "name": "Virgin Islands",
        "code": "VI"
    },
    {
        "name": "Virginia",
        "code": "VA"
    },
    {
        "name": "Washington",
        "code": "WA"
    },
    {
        "name": "West Virginia",
        "code": "WV"
    },
    {
        "name": "Wisconsin",
        "code": "WI"
    },
    {
        "name": "Wyoming",
        "code": "WY"
    }
];
var FormValidation = React.createClass({
  getInitialState() {
    return {
      locations: [
        { states: false }
      ]
    };
  },

  addLocation() {
    var locations = this.state.locations;
    this.setState({ locations: locations += 1 });
  },

  validate(listType, e) {
    if (listType === 'countries') {
      if (e.target.value !== 'US') {
        this.setState({ disabled: { states: true } });
      } else {
        this.setState({ disabled: { states: false } });
      }
    }
  },

  handleSubmit(e) {
    debugger
  },

  render() {
    var locations = [];
    for (var i = 0; i < this.state.locations; i++) {
      var locationField = (
        <LocationField key={i} disabledFields={this.state.disabled} ref={`locale-${i}`} validate={this.validate} />
      );
      locations.push(locationField);
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className='form-horizontal col-md-8'>
          <Field validate={this.validate} required={false} type='text' name='firstName' label='First Name' />
          <Field validate={this.validate} required={true} type='text' name='lastName' label='Last Name' />
        </div>

        <div className='col-md-8'>
          {locations}
        </div>

        <div className='submission col-md-3'>
          <button className='form-control btn-default' onClick={this.addLocation} type='button' value='Add Location'>Add Location</button>
          <button className='form-control btn-default' type='submit'>Submit</button>
        </div>
      </form>
    );
  }
});

var LocationField = React.createClass({
  render() {
    return (
      <div className='form-horizontal' key={this.props.key}>
        <Field validate={this.props.validate} type='text' name='city' label='City' />
        <Field items={STATES} validate={this.props.validate} type='text' name='state' label='State' />
        <Field items={COUNTRIES} validate={this.props.validate} type='text' name='country' label='Country' />
        <Field validate={this.props.validate} type='text' name='postal' label='Postal' />
      </div>
    );
  }
});

var Field = React.createClass({
  validate(e) {
    this.props.validate(e, this.props.name);
  },

  render() {
    var input = this.props;
    var formOption;
    if (input.items) {
      var opts = input.items.map((item, idx)=>{
        return <option value={item.code} key={idx}>{item.name}</option>;
      });
      formOption = (
        <select onChange={this.validate} className='form-control' defaultValue="US">
          {opts}
        </select>
      );
    }
    return (
      <div className='form-group'>
        {formOption}
        <input onChange={this.validate} className='form-control' type={input.type} name={input.name} placeholder={input.label}></input>
      </div>
    );
  }
});

React.render(
  <FormValidation />,
  document.getElementById("form-validation")
);
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Autosuggest from 'react-autosuggest';

const locations = [  
  {
    id: '0',
    value: '131B'
  },
  {
    id: '1',
    value: '45B'
  },
  {
    id: '2',
    value: '33C'
  },
  {
    id: '3',
    value: '14B'
  },
  {
    id: '4',
    value: '96D'
  }
];

/* Autosuggestion configuration */

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : locations.filter(loc =>
    loc.value.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.value;
const getSuggestionId = suggestion => suggestion.id;


// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.value}
  </div>
);

class LocationValueItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: props.defaultLocationCode ? this.getLocationValue(this.props.defaultLocationCode, this.props.locationsMap) : '',
      suggestions: []
    };
    
    this.getLocationValue = this.getLocationValue.bind(this);
    this.getIdFromValue = this.getIdFromValue.bind(this);
  }

  getLocationValue(id, list) {
    return (list.find(item => 
      item.id === id
    ).value);
  };

  getIdFromValue(value, list){
    return (list.find(item => 
      item.value === value.toUpperCase()
    )) || {id: '', value: value};
  };
  

  onBlur = (event, { newValue }) => {
    console.log(this.state.value);
    console.log(this.getIdFromValue(this.state.value, this.props.locationsMap).id);
    
    if (this.getIdFromValue(this.state.value, this.props.locationsMap).id === ''){
      this.props.addLocationItemMap(this.state.value);
      this.props.changeLocationValues(this.props.locationId, this.getIdFromValue(this.state.value, this.props.locationsMap).id, '');  
    }

    
    
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
    console.log(newValue);
    console.log(this.getIdFromValue(newValue, this.props.locationsMap));
    this.props.changeLocationValues(this.props.locationId, this.getIdFromValue(newValue, this.props.locationsMap).id, '');
  };
  
  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {    
    this.setState({
      suggestions: []
    });
  };  

  render(){
    
    const { value, suggestions } = this.state;
    
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Location',
      value,
      onChange: this.onChange,
      onBlur: this.onBlur
    };

    return (
      <div>
        <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
              />
      </div>
    )
  }
}

class LocationQtyItem extends Component {

  constructor(props){
    super(props);
    this.state = {
      quantity: this.props.quantity
    }
    this.changeQtyValue = this.changeQtyValue.bind(this);
    this.makeChange = this.makeChange.bind(this);
  }

  makeChange(event){
    console.log(event.target.value);
    this.setState(
      {
        quantity: event.target.value
      }
    )
    this.props.changeLocationValues(this.props.locationId, '', this.state.quantity);
    
    if (this.state.quantity === '0'){
      this.props.deleteLocationItem(this.props.locationId);
    }
  }

  changeQtyValue(event){
    this.setState(
      {
        quantity: event.target.value
      }
    )
  }

  render(){
        
    return (
      <div>
        <input type="name" value={this.state.quantity} onBlur = {this.makeChange} onChange = {this.changeQtyValue} ></input>
      </div>
    )
  }
}

class LocationItem extends Component {

  render(){
    const locationId = this.props.locationId;
    const quantity = this.props.quantity;
    const locationCode = this.props.locationCode;

    return (
      <div>
        <LocationValueItem locationId={locationId} defaultLocationCode = {locationCode} 
          changeLocationValues = {this.props.changeLocationValues} locationsMap = {this.props.locationsMap}
          addLocationItemMap = {this.props.addLocationItemMap} deleteLocationItem = {this.props.deleteLocationItem} />
        
        <LocationQtyItem locationId={locationId} quantity = {quantity} deleteLocationItem = {this.props.deleteLocationItem}
        changeLocationValues = {this.props.changeLocationValues} />
      </div>
    )
  }
}

class LocationList extends Component {

  render(){
    const listOfLocations = this.props.list;
    
    const renderLocation = listOfLocations.map((item) =>
      <LocationItem key={item.id} locationId = {item.id} locationCode = {item.code} quantity = {item.quantity} 
      changeLocationValues = {this.props.changeLocationValues} locationsMap = {this.props.locationsMap}
      addLocationItemMap = {this.props.addLocationItemMap} deleteLocationItem = {this.props.deleteLocationItem} />
    );


    return (
      <div>
        {renderLocation}
      </div>
    )
  }
}

/*const myLocations = [
  {id: '0', code: '3', quantity: '2'}, {id: '1', code: '1', quantity: '1'}, {id: '2', code: '4', quantity: '1'}
];*/

const myLocations = [];

function sumList(list){
  let total = 0;
  for (let item of list){
    total = total + Number(item.quantity);
  };
  return total;
}

class TotalListingQty extends Component {
  render(){
    const listLocations = this.props.list;
    return (
      <p>Quantity: {sumList(listLocations)}</p>
    )
  }
  
}

class ListingForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      locations: this.props.list.length > 0 ? this.props.list : [{id: '0', code: '', quantity: '0'}],
      locationsMap: this.props.locationsMap
    };
    this.changeLocationValues = this.changeLocationValues.bind(this);
    this.addLocationItemMap = this.addLocationItemMap.bind(this);
    this.deleteLocationItem = this.deleteLocationItem.bind(this);
  }
  
  addLocationItemMap(newValue){
    let newList = this.state.locationsMap;
    const lastItem = newList.slice(-1)[0]
    const newId = String(Number(lastItem.id)+1);
    
    if (newValue !== ''){
      newList.push({id: newId, value: newValue.toUpperCase() });
    
      this.setState(
        {
          locationsMap: newList
        }
      );
    };

    return newId; 
  }
  
  
  
  addLocationItem(){
    let newList = this.state.locations;
    const lastItem = newList.slice(-1)[0]
    const newId = String(Number(lastItem.id)+1);
    newList.push({id: newId, code: '', quantity: '1'}) 
    this.setState(
      {
        locations: newList
      }
    )
  }
  
  deleteLocationItem(locationId){
    const newList = this.state.locations.filter(item =>
      item.id !== locationId
    );
    
    this.setState(
      {
        locations: newList.length > 0 ? newList : [{id: '0', code: '', quantity: '0'}]
      }
    );
  
  }

  changeLocationValues(locationId, newValue, newQty){
    let newList = [];
    //console.log(newValue, newQty);
    for (let item of this.state.locations){
      if (item.id === locationId){
        newList.push({id: item.id, code: (newValue !== '' ? newValue : item.code), quantity: (newQty !== '' ? newQty : item.quantity)});
      } else {
        newList.push({id: item.id, code: item.code, quantity: item.quantity});
      }
      //console.log(newList);
      //console.log(locations);
    }
    this.setState({
      locations: newList
    })

    console.log(newList);
    const lastItem = newList.slice(-1);
    //console.log(lastItem);
    if (lastItem[0].code !== '' && Number(lastItem[0].quantity) > 0) {
      newList.push({id: String((Number(lastItem[0].id) + 1)) , code: '', quantity: '0'});
    }

    /*this.setState({
      locations: newList
    })*/
  }
  
  render(){
    
    return (
      <div>
        <h1>Location List</h1>
        <form>
          <LocationList list = {this.state.locations} changeLocationValues = {this.changeLocationValues} 
          locationsMap = {this.state.locationsMap} addLocationItemMap = {this.addLocationItemMap}
          deleteLocationItem = {this.deleteLocationItem} />
          <TotalListingQty list = {this.state.locations} />
        </form>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Listing Form</h1>
        <ListingForm list = {myLocations} locationsMap = {locations} />
      </div>
    );
  }
}

export default App;

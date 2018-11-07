import React, {Component} from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';

class App extends Component {
  state = {
    lat: 38.829825,
    //lat:29.7607245,
    //lon:-95.7768667,
    lon: -77.511603,
    zoom: 11,
    all: locations
  }

  render = () => {
    return (
      <div className="App">
        <div>
          <h1>NoVa Movie Theaters</h1>
        </div>
        <MapDisplay
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          locations={this.state.all}/>
      </div>
    );
  }
}

export default App;

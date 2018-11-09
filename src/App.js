import React, {Component} from 'react';
import './App.css';
import theatres from './data/theatres.json';
import MovieMap from './components/MovieMap';
import SearchMenu from './components/SearchMenu';


//Transition to non-deprecated material-ui typography
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  state = {
    lat: 38.829825,
    lon: -77.511603,
    zoom: 11,
    all: theatres,
    filtered: null,
    open:false
  }

  styles = {
      menuButton: {
        marginLeft: 10,
        marginRight: 20,
        position: "absolute",
        left: 10,
        top: 20,
        background: "white",
        padding: 10
      },
      hide: {
        display: 'none'
      },
      header: {
        marginTop: "0px"
      }
    };

    componentDidMount = () => {
      this.setState({
        ...this.state,
        filtered: this.filtertheatres(this.state.all, "")
      });
    }

    toggleDrawer = () => {
      this.setState({
        open: !this.state.open
      });
    }

    updateQuery = (query) => {
      this.setState({
        ...this.state,
        selectedIndex: null,
        filtered: this.filtertheatres(this.state.all, query)
      });
    }

    filtertheatres = (theatres, query) => {
      return theatres.filter(location => location.name.toLowerCase().includes(query.toLowerCase()));
    }

    clickListItem = (index) => {
      this.setState({ selectedIndex: index, open: !this.state.open })
    }


  render = () => {
    return (
      <div className="App">
        <div role= "application">
        <button tabIndex="0" onClick={this.toggleDrawer} style={this.styles.menuButton}>
          Search
         </button>
          <h1>NoVa Movie Theaters</h1>
        </div>
        <MovieMap
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          theatres={this.state.filtered}
          selectedIndex={this.state.selectedIndex}
          clickListItem={this.clickListItem}/>
          <SearchMenu
           theatres={this.state.filtered}
           open={this.state.open}
           toggleDrawer={this.toggleDrawer}
           filtertheatres={this.updateQuery}
           clickListItem={this.clickListItem}/>
      </div>
    );
  }
}

export default App;

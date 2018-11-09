import React, {Component} from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import ErrorBoundary from './ErrorBoundary';

const CLIENT = "IMTAB1NBA1VVX5C1MKNGXK1O4EBJNP5X5YWRHIWP53VULJOK";
const MAP_KEY = "AIzaSyCD1U9BpHeQfx0vRIwuWzJFQ4fJWhO_E4c";
const SECRET = "ICD1IWIQ4CRBBDK1YOPBR2UZHRCR4SDTXIX13DFPJFFYSPCM";
const VERSION = "20181104";


class MovieMap extends Component {
   state = {
        map: null,
        markers: [],
        markerProps: [],
        selectedMarker: null,
        selectedMarkerProps: null,
        showingInfoWindow: false
    };
    componentDidMount = () => {
//Error Handling
      window.gm_authFailure = () => {
        alert("Google Mapps has failed to load.");
};

    }
    componentWillReceiveProps = (props) => {
              if (this.state.markers.length !== props.theatres.length) {
                this.closeInfoWindow();
                this.updateMarkers(props.theatres);
                this.setState({selectedMarker: null});
                return;
            }

            if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
                return;
            };
            this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex])
        }
    mapReady = (props, map) => {
        this.setState({map});
        this.updateMarkers(this.props.theatres);
    }

    closeInfoWindow = () => {
        this.state.selectedMarker && this.state.selectedMarker.setAnimation(null);
        this.setState({showingInfoWindow: false, selectedMarker: null, selectedMarkerProps: null});
    }

    getTheatreStat = (props, data) => {
        return data.response.venues.filter(item => item.name.includes(props.name) || props.name.includes(item.name));
    }

    onMarkerClick = (props, marker, e) => {
        this.closeInfoWindow();

//Settingup foursquare data
        let url = `https://api.foursquare.com/v2/venues/search?client_id=${CLIENT}&client_secret=${SECRET}&v=${VERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;
        let headers = new Headers();
        let request = new Request(url, {
            method: 'GET',
            headers
        });
        let selectedMarkerProps;
        fetch(request)
            .then(response => response.json())
            .then(result => {
                let theatre = this.getTheatreStat(props, result);
                selectedMarkerProps = {
                    ...props,
                    foursquare: theatre[0]
                };
                if (selectedMarkerProps.foursquare) {
                    let url = `https://api.foursquare.com/v2/venues/${theatre[0].id}/photos?client_id=${CLIENT}&client_secret=${SECRET}&v=${VERSION}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(result => {
                            selectedMarkerProps = {
                                ...selectedMarkerProps,
                                images: result.response.photos
                            };
                            if (this.state.selectedMarker)
                                this.state.selectedMarker.setAnimation(null);
                            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                            this.setState({showingInfoWindow: true, selectedMarker: marker, selectedMarkerProps});
                        })
                } else {
                    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                    this.setState({showingInfoWindow: true, selectedMarker: marker, selectedMarkerProps});
                }
            })
    }

    updateMarkers = (theatres) => {
          if (!theatres)
            return;
        this.state.markers.forEach(marker => marker.setMap(null));
        let markerProps = [];
        let markers = theatres.map((location, index) => {
        let mProps = {
                key: index,
                index,
                name: location.name,
                position: location.pos,
                url: location.url,
                amenities: location.amenities
            };
            markerProps.push(mProps);
        let animation = this.props.google.maps.Animation.DROP;
        let marker = new this.props.google.maps.Marker({position: location.pos, map: this.state.map, animation});
            marker.addListener('click', () => {
                this.onMarkerClick(mProps, marker, null);
            });
            return marker;
        })

        this.setState({markers, markerProps});
    }

    render = () => {
        const center = {
            lat: this.props.lat,
            lng: this.props.lon
        }
        let smProps = this.state.selectedMarkerProps;

        return (
        <ErrorBoundary>
            <Map
                onReady={this.mapReady}
                google={this.props.google}
                zoom={this.props.zoom}
                initialCenter={center}
                onClick={this.closeInfoWindow}>
                <InfoWindow
                    marker={this.state.selectedMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.closeInfoWindow}>
                    <div>
                        <h3>{smProps && smProps.name}</h3>
                        <h4>{smProps && smProps.amenities}</h4>
                        {smProps && smProps.images
                            ? (
                                <div><img
                                    alt={smProps.name + " theatre image"}
                                    src={smProps.images.items[0].prefix + "100x100" + smProps.images.items[0].suffix}/>
                                    <p>Foursquare</p>
                                </div>
                            )
                            :<p>Sorry, No Image is Available </p>
                        }
                    </div>
                </InfoWindow>
            </Map>
      </ErrorBoundary>
        )
    }
}


export default GoogleApiWrapper({apiKey: MAP_KEY})(MovieMap)

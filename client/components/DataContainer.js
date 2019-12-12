import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';


var spotifyWebApi = null;

export default class DataContainer extends Component {
    
    constructor(props) {
        super(props);
    
        this.state = {
            redditItems: this.props.redditItems,
            spotifyItems: []
        };

        this.spotifyWebApi = this.props.spotifyApi;
    }

    componentDidMount() {
        console.log("this.state.redditItems = ")
        console.log(this.state.redditItems);
        console.log("this.spotifyAPi = ")
        console.log(this.spotifyWebApi);
    }
    
    render() {
        return (
            <div className="dataContainer">
                <h1>This will render after reddit loads and searches Spotify</h1>
            </div>
        )
    }
}

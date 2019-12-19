import React, { Component } from 'react'
import PlaylistsModal from '../PlaylistsModal/PlaylistsModal';
import './SpotifyTrack.css';

export default class SpotifyTrack extends Component {

    constructor(props){
        super(props);
        this.state = {
            youtubeTitle : this.props.youtubeTitle,
            spotifyWebApi : this.props.spotifyWebApi,
            accessToken : this.props.accessToken,
            showPlaylists: false,
            playlists : this.props.playlists
        };

        this.togglePlaylists = this.togglePlaylists.bind(this);
    }

    componentDidMount(){
        
        if(this.state.youtubeTitle === null || typeof this.state.youtubeTitle === 'undefined'){
            let emptyTrack = {
                uri : "not found",
                id : "not found",
                artist: "not found",
                trackName : "not found",
                previewUrl: "not found"
            };

            this.setState({
                trackDetails : emptyTrack
            });

            return;
        }

        let spotifyWebApi = this.state.spotifyWebApi;

        return spotifyWebApi.searchTracks(this.state.youtubeTitle)
            .then(data => {
                try{
                    var track = {};
                    if(data.tracks.items.length === 0) {
                        track = this.emptyTrack();
                    }
                    else{
                        track = data.tracks.items[0];
                    }

                    var trackInfo = {
                        id:track.id,
                        artist: track.artists[0].name,
                        trackName: track.name,
                        previewUrl : track.preview_url,
                        uri: track.uri
                    };
                    
                    this.setState({
                        trackDetails: trackInfo
                    });                 
                }
                catch(e) {
                    
                }
            }, error => {
                console.error(error);
            });
    }
    

    objectIsEmpty(obj){
        if(obj === null || typeof obj === "undefined") {
            return false;
        }
        return Object.entries(obj).length === 0 && obj.constructor === Object;
    }

    emptyTrack(){
        return {
            id : "not found",
            artist: "not found",
            trackName : "not found",
            previewUrl: "not found",
            uri: "not found"
        };
    }

    togglePlaylists() {
        this.setState({
            showPlaylists: false
        });
    }

    render() {
        var track = this.state.trackDetails ? this.state.trackDetails : this.emptyTrack();
        
        const buttonText = track["trackName"] !== "not found" ? "Add to Spotify Playlist" : "Not Found On Spotify";
        const disabled = buttonText === "Not Found On Spotify" ? "disabled" : "";
        
        return (
            <div>   
                <button onClick={() => {this.setState({showPlaylists: true})}} className="addButton" disabled={disabled}>{buttonText}</button>
                {this.state.showPlaylists? <PlaylistsModal togglePlaylists={this.togglePlaylists} trackUri={track.uri} playlists={this.state.playlists} spotifyWebApi={this.state.spotifyWebApi} /> : null}
            </div>
        )
    }
}

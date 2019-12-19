import React , {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import './PlaylistsModal.css'

export default class PlaylistsModal extends Component {

  constructor(props){
    super(props);
    this.state = {
      show: true,
      setShow : true,
      trackUri : this.props.trackUri,
      playlists: this.props.playlists,
      spotifyWebApi : this.props.spotifyWebApi,
      buttonText : "Add",
      playlistsUpdated: {}
    }
  }
  componentDidMount(){
    this.setState({
      show : true
    });

    let playlistsUpdatedInitial = {};

    this.state.playlists.forEach(playlist => {
        playlistsUpdatedInitial[playlist.id] = "Add";
    });

    console.log(playlistsUpdatedInitial);

    this.setState({playlistsUpdated : playlistsUpdatedInitial});

    // console.log(this.state);
  }

  componentWillUnmount(){
    console.log("CLOSING");
  }

  handleClose() {
    this.setState({
      show : false
    });

    this.props.togglePlaylists();
    
  }

  handleShow() {
    this.setState({
      show : true
    });
  }

  addToPlaylist(playlistId, trackUri) {
    let spotifyWebApi = this.state.spotifyWebApi;

    spotifyWebApi.addTracksToPlaylist(playlistId, [trackUri], (err, succ) => {
      if(err){
        alert(err.response);
      }
      else{
        let playlistUpdatesCopy = JSON.parse(JSON.stringify(this.state.playlistsUpdated));
        playlistUpdatesCopy[playlistId] = "Added";
        this.setState({
          playlistsUpdated : playlistUpdatesCopy
        });
      }
    });
  }
  
  render() {
    
    const playlistItems = this.state.playlists.map( playlist => {
      var image = playlist.images[0];
      var url = "";

      if(typeof image === 'undefined' || image === null || !('url' in image)){
        url = ""
      }
      else{
        url = image.url;
      }

      let playlistStatuses = this.state.playlistsUpdated;

      return(
        <div key={playlist.id} className="playlistDetails">
            <p className="playlistName">
              <a href={playlist.external_urls.spotify} target="_blank" className="playlistLink">
                {playlist.name}
              </a>
            </p>
            {url !== "" ? <img src={playlist.images[0].url} className="playlistImage"/> : null}
            <button onClick = {() => {this.addToPlaylist(playlist.id, this.state.trackUri)}} className="addButtonModal">{playlistStatuses[playlist.id]}</button>
        </div>
      );
    });

    return (
      <> 
        <Modal show={this.state.show} onHide={() => {this.setState({show:false}); this.props.togglePlaylists();}}>
          <Modal.Header>
            <Modal.Title><span className="playlistsTitle">Your Playlists</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>{playlistItems}</Modal.Body>
        </Modal>
      </>
    );
  }
}

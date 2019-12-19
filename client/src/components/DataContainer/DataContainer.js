import React, { Component } from 'react';
import Iframe from 'react-iframe';
import SpotifyTrack from '../SpotifyTrack/SpotifyTrack';
import { Container, Row, Col } from 'react-bootstrap';
import './DataContainer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faReddit} from '@fortawesome/free-brands-svg-icons';

export default class DataContainer extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            loggedIn: this.props.accessToken? true: false,
            redditItems: this.props.redditItems,
            spotifyItems: [],
            spotifyWebApi: this.props.spotifyWebApi,
            trackDetails : null,
            accessToken : this.props.accessToken,
            playlists : this.props.playlists
        };
    }
        
    cleanUrl(url){
        var cleanedUrl = url.replace("watch?v=" , "embed/");
        console.log(cleanedUrl.split("&")[0]  + "\n");
        return cleanedUrl.split("&")[0];
    }
    
    cleanRedditTitle(redditTitle){
        return redditTitle.replace(/\(.*?\)|\[.*?\]/g, "").replace("\"", "").replace("--", "-").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }

    render() {
        const renderPosts = this.state.redditItems.map( (post) => {
            let title = this.cleanRedditTitle(post.title);
            let cleanedUrl = this.cleanUrl(post.url);
            // the 'searchSpotify' method call updates the state of the component and allows the component to be re-rendered once the state has beem changed.
            const trackDetails = 
                    <Row className="dataRow">
                        <Col>
                            <Iframe url={cleanedUrl} width="350px" height="200px" className="iframe"/>
                        </Col>
                        <Col>
                            <h5 className="songTitle">{title}</h5>
                            <a href = {"https://reddit.com"+post.permalink} target="_blank"><h3><FontAwesomeIcon icon={faReddit} size="3x" className="redditIcon"/></h3></a>
                        </Col>
                        <Col>
                            <SpotifyTrack
                                className="trackContainer"
                                youtubeTitle={title} 
                                spotifyWebApi={this.state.spotifyWebApi}
                                accessToken={this.state.accessToken} 
                                playlists={this.state.playlists}
                            />
                        </Col>
                    </Row>;            
            return trackDetails;
            
        });

        return (
            <div className="dataContainer">
                {renderPosts}
            </div>
        )
    }
}

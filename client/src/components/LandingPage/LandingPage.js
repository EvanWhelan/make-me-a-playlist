import React, { Component } from 'react'
import './LandingPage.css';
export default class LandingPage extends Component {
    
    redirectToSpotifyLogin() {
        window.location.href = "http://localhost:8888/spotify-login";
    }

    render() {
        return (
            <div>
                <h3 className="landingHeader">Please log in to your Spotify Account to continue using this app</h3>
                <button onClick={() => this.redirectToSpotifyLogin()} className="loginButton">Login</button>
            </div>
        )
    }
}

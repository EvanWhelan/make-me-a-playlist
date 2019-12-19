import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import {Button, Dropdown, ButtonToolbar, Container, Row, Col} from 'react-bootstrap';
import './App.css';
import DataContainer from './components/DataContainer/DataContainer';
import LandingPage from './components/LandingPage/LandingPage';
import PlaylistsModal from './components/PlaylistsModal/PlaylistsModal';

const spotifyWebApi = new Spotify();

class App extends Component{

  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token? true: false,
      searchResults: {},
      redditCategory: "Category",
      redditTime: "Time",
      redditResults: [],
      toggleTime: true,
      redditIsLoaded: false,
      userPlaylists: [],
      displayPlaylists: false,
      accessToken : params.access_token
    }

    if(params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);

      spotifyWebApi.getMe()
        .then( user => {
          // 
          this.setState({userId : user.id});
        });

      spotifyWebApi.getUserPlaylists({limit: 50})
        .then( 
          data => {

            var usersOwnPlaylists = [];

            data.items.forEach(playlist => {
              
              if(playlist.owner.id === this.state.userId){
                usersOwnPlaylists.push(playlist);
              }
            });

            this.setState({
              userPlaylists: usersOwnPlaylists
            });
          },
          error => {
            console.error(error);
          }
        );

    }

  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  setRedditTime(timeSpan){
    this.setState({
      redditTime: timeSpan
    });
  }

  setRedditCategory(category){
    var showTime;
    if(category.toLowerCase() === "hot" || category.toLowerCase() === "rising" || category.toLowerCase() === "new") {
      showTime = false;
    }
    else{
      showTime = true;
    }

    this.setState({
      redditCategory: category,
      toggleTime: showTime
    });    
  }


  queryReddit() {

    // these state changes reset the list of reddit posts so that they can be re-rendered when the options are changed
    this.setState({redditIsLoaded: false});
    this.setState({redditItems : []});

    var time = "";  
    var category = this.state.redditCategory.toLowerCase();

    if(category === "category") {
      alert("Please enter a category");
      return;
    }

    switch(this.state.redditTime){
      case "Now":{
        time = "now";
        break;
      }
      case "Today":{
        time= "day";
        break;
      }
      case "This Week":{
        time= "week";
        break;
      }
      case "This Month":{
        time= "month";
        break;
      }
      case "This Year":{
        time= "year";
        break;
      }
      case "All Time":{
        time= "all";
        break;
      }
      default: {
        time= "all";
        break;
      }    
    }

    var redditQueryUrl = "";
    if(category === "hot" || category === "rising" || category === "new") {
      redditQueryUrl = "https://www.reddit.com/r/listentothis/" + category + ".json?t=now";
    }
    else{
      redditQueryUrl = "https://www.reddit.com/r/listentothis/"+category+".json?t="+time+"&limit=500";
    } 

    fetch(redditQueryUrl)
      .then( response => {
        return response.json();
      })
      .then( (json) => {
        var ar = [];
        var posts = json.data.children;
        
        for(let i = 0; i < posts.length; i++){
          var currentPost = posts[i];
          if(currentPost.kind !== "t3") {
              continue;
          }

          currentPost = currentPost.data;
          var postIsValid = this.isValidPost(currentPost);
          // 
          if(postIsValid){ 
              ar.push(currentPost);
          }
        }
        
        this.setState({
          redditResults: ar,
          redditIsLoaded: true
        });      
      });
  }

  isValidPost(post){
    if(!post.url.toLowerCase().includes("youtube.com")) {
        return false;
    }
    return true;
  }

  redirectToLogin() {
    window.location.href="http://localhost:8888/spotify-login";
  } 

  render() {
    var timeDropDown = 
      <Dropdown className="dt">
      <Dropdown.Toggle variant="outline-success" className="reddit-dropdown">
        {this.state.redditTime}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => this.setRedditTime("Now")}>Now</Dropdown.Item>
        <Dropdown.Item onClick={() => this.setRedditTime("Today")}>Today</Dropdown.Item>
        <Dropdown.Item onClick={() => this.setRedditTime("This Week")}>This Week</Dropdown.Item>
        <Dropdown.Item onClick={() => this.setRedditTime("This Month")}>This Month</Dropdown.Item>
        <Dropdown.Item onClick={() => this.setRedditTime("This Year")}>This Year</Dropdown.Item>
        <Dropdown.Item onClick={() => this.setRedditTime("All Time")}>All Time</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>;

    var mainContent = 
    <div>
      <Row>
        <Col>
          <h2 className="title">MAKE ME A PLAYLIST</h2>
        </Col>
      </Row>
      <Row>
        <Col>
        <ButtonToolbar>
          <Dropdown className="dt">
              <Dropdown.Toggle variant="outline-success" className="reddit-dropdown">
                {this.state.redditCategory}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => this.setRedditCategory("Hot")}>Hot</Dropdown.Item>
                <Dropdown.Item onClick={() => this.setRedditCategory("New")}>New</Dropdown.Item>
                <Dropdown.Item onClick={() => this.setRedditCategory("Controversial")}>Controversial</Dropdown.Item>
                <Dropdown.Item onClick={() => this.setRedditCategory("Top")}>Top</Dropdown.Item>
                <Dropdown.Item onClick={() => this.setRedditCategory("Rising")}>Rising</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {this.state.toggleTime? timeDropDown: null}
            <Button variant="success" onClick = {() => this.queryReddit()}>Go</Button>
        </ButtonToolbar>
        {this.state.redditIsLoaded? <DataContainer redditItems={this.state.redditResults} spotifyWebApi = {spotifyWebApi} accessToken={this.state.accessToken} playlists={this.state.userPlaylists}/> : null}
        </Col>
      </Row>
        </div>; 

    return (
      <div className="App">
        <Container>
          {this.state.loggedIn ? mainContent : <LandingPage />}
        </Container>
        
      </div>
    );
  }
}

export default App;

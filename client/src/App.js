import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';
import {Button, Dropdown, ButtonToolbar} from 'react-bootstrap';

const spotifyWebApi = new Spotify();

class App extends Component{

  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token? true: false,
      nowPlaying: {
        name: "Not Checked!",
        image: ''
      },
      searchResults: {},
      redditCategory: "Category",
      redditTime: "Time",
      redditResults: [],
      toggleTime: true
    }

    if(params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }

  }

  componentDidMount() {
    console.log(this.state);
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

  searchForSong(){
      spotifyWebApi.searchTracks('Love')
        .then( data => {
          console.log("Searched");
          this.setState({
            searchResults: data.tracks.items
          });

          console.log(this.state);

        }, (err) => {
          console.log(err);
        });
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

    console.log(this.state);
    
  }

  queryReddit() {
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
        console.log("Logging result");
        console.log(json.data.children);
        for(let i = 0; i < posts.length; i++){
          var currentPost = posts[i];
          if(currentPost.kind != "t3") {
              continue;
          }
          currentPost = currentPost.data;
          ar.push(currentPost);
          
        }
        
        this.setState({
          redditResults: ar
        });
        console.log("Querying reddit url: " + redditQueryUrl);
        console.log(this.state);
      });
  }

  isValidPost(post){
    var title = post.title.toLowerCase();
    var validTitle = !title.includes("discussion") && !title.includes("playlist");

    if(!post.url.toLowerCase().includes("youtube.com")) {
        return false;
    }

    var validFlair = this.isValidFlair(post.link_flair_text);
    var validArchive = post.archived == true;

    return validFlair && validTitle && validArchive;
}

  isValidFlair(flair){
      if (flair == null) {
          return false;
      } else {
          var flairText = flair.toLowerCase();
          return !flairText.includes("discussion") && 
          !flairText.includes("playlist");
      }
  }

  getRedditResults(category, time){
    var redditQuery = "https://www.reddit.com/r/listentothis/top.json?"
  }

  render() {

    var timeDropDown = 
      <Dropdown className="dt">
      <Dropdown.Toggle variant="primary" className="reddit-dropdown">
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

    return (
      <div className="App">
        <h1>Reddit To Playlist</h1>
        <div>
        <ButtonToolbar>
          <Dropdown className="dt">
              <Dropdown.Toggle variant="primary" className="reddit-dropdown">
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
            <Button onClick= {() => this.queryReddit()}>Go</Button>
        </ButtonToolbar>
        </div>
      </div>
    );
  }
}

export default App;

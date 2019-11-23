import React from "react";

import { withRouter } from "react-router-dom";

import "../App.css";
import "../homepage.css";

import FeaturedArtist from "../Components/Blocks/featuredArtist";
import FeaturedPlaylist from "../Components/Blocks/featuredPlaylist";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      tracks: []
    };
  }
  componentDidMount() {
    this.props.spotifyData.player
      .getPersonalizedTopTracks("artists", 10, 0)
      .then(result => {
        this.props.spotifyData.player
          .getPersonalizedTopTracks("tracks", 10, 0)
          .then(data => {
            this.setState({
              ...this.state,
              result: result.items,
              tracks: data.items
            });
          });
      });
  }

  handleClick = (uri, active) => {
    let { playSong, ResumePlayer, StopPlayer } = this.props.spotifyData.player;
    if (!active) {
      this.props.spotifyData.player
        .getPersonalizedTopTracks("tracks", 40, 10)
        .then(data => {
          this.setState({
            ...this.state,
            tracks: [...this.state.tracks, ...data.items]
          });
          let index = this.state.tracks.findIndex(track => track.uri === uri);
          let currentSongs = this.state.tracks
            .slice(index, this.state.tracks.length)
            .map(track => {
              return track.uri;
            });
          let newItems = [];
          this.state.tracks
            .slice(index, this.state.tracks.length)
            .concat(this.state.tracks.slice(0, index - 1))
            .forEach((track, idx) => {
              track.order = idx;
              newItems.push(track);
            });
          this.props.ResetQueue(newItems);
          let previousSongs = this.state.tracks.slice(0, index).map(track => {
            return track.uri;
          });
          let uris = JSON.stringify([...currentSongs, ...previousSongs]);
          playSong(uris).then(
            result =>
              this.setState({
                ...this.state,
                currentSong: uri,
                isPlaying: true
              })
            //hege.slice(1).concat(stale.slice(1)).forEach((item, idx) => list.push(item + idx))
          );
        });
    } else if ((active, this.props.player.isPlaying === false)) {
      ResumePlayer();
      this.props.togglePlay();
    } else {
      StopPlayer();
      this.props.togglePlay();
    }
  };

  render() {
    let topArtists = [];
    let topTracks = [];
    this.state.result.forEach((item, idx) => {
      let active = false;
      if (this.props.player.artistId === item.id) {
        active = true;
      }
      topArtists.push(
        <FeaturedArtist
          player={this.props.spotifyData}
          ResetQueue={this.props.ResetQueue}
          key={`featured-artist-${idx}`}
          url={item.images[0].url}
          name={item.name}
          active={active}
          artistId={item.id}
          isPlaying={this.props.player.isPlaying}
        />
      );
    });
    this.state.tracks.slice(0, 10).forEach((item, idx) => {
      let active = false;
      if (this.props.player.currentSong.id === item.id) {
        active = true;
      }
      topTracks.push(
        <FeaturedPlaylist
          key={`featured-playlist-${idx}`}
          url={item.album.images[0].url}
          name={item.name}
          artistName={item.artists[0].name}
          player={this.props.spotifyData}
          ResetQueue={this.props.ResetQueue}
          active={active}
          songUri={item.uri}
          item={item}
          handleClick={this.handleClick}
          isPlaying={this.props.player.isPlaying}
        />
      );
    });
    return (
      <div className="main">
        <div className="favorites-title">
          <h1>Favorite Artists</h1>
        </div>
        <div className="recomended-artists">{topArtists}</div>
        <h1>Recently Played</h1>
        <div className="recomended-artists">{topTracks}</div>
      </div>
    );
  }
}

export default withRouter(Home);

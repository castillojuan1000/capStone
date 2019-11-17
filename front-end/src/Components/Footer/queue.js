import React from "react";
import QueueMusicIcon from "@material-ui/icons/QueueMusic";
import { connect } from "react-redux";
import Playlist from "./playlist";
import Song from "../../Components/Blocks/songshort";
import Station from "./station.js";
import { withApollo } from "react-apollo";
import { GET_ALL_ROOMS } from "../../Apollo/index";

const querySubcribe = client => {
  return client.watchQuery({
    query: GET_ALL_ROOMS,
    fetchPolicy: "cache-and-network",
    pollingInterval: "30000"
  });
};
let QueueFilter = ({ name, isActive, onClick, color }) => {
  let className = isActive === name ? "active" : "";
  let border = isActive === name ? { borderBottom: `2px solid ${color}` } : {};
  return (
    <li style={border} onClick={() => onClick(name)} className={className}>
      {name}
    </li>
  );
};

class Queue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilter: "Queue",
      color: this.props.color,
      isActive: this.props.isActive,
      toggleQ: this.props.toggleQ,
      rooms: []
    };
    this.setSearchFilter = this.setSearchFilter.bind(this);
  }
  componentDidMount() {
    querySubcribe(this.props.client).subscribe({
      next: ({ data }) => {
        if (data !== undefined) {
          let { getAllRooms: rooms } = data;
          const { spotifyData } = this.props;
          const roomPlaylistsIds = rooms.map(e => e.spotifyId);
          const hostSpotifyIds = rooms.map(e => e.host.spotifyId);
          Promise.all(
            roomPlaylistsIds
              .map(e => spotifyData.player.GetPlaylist(e))
              .concat(
                hostSpotifyIds.map(e => spotifyData.player.getUserProfile(e))
              )
          )
            .then(results => {
              const roomPlaylists = results.filter(e => e.type === "playlist");
              const hosts = results.filter(e => e.type === "user");
              rooms = rooms.map((e, i) => {
                e.playlist = roomPlaylists[i];
                e.host = hosts[i];
                return e;
              });
              return rooms;
            })
            .then(rooms => this.setState({ rooms }));
        }
      },
      error: e => console.error(e)
    });
  }
  setSearchFilter = name => {
    this.setState({
      ...this.state,
      activeFilter: name
    });
  };

  getFilterItems = () => {
    let searchFilters = ["Queue", "Playlists", "Stations"];
    let ListItems = [];
    searchFilters.forEach((name, idx) => {
      ListItems.push(
        <QueueFilter
          key={`queue-filter-${idx}`}
          onClick={this.setSearchFilter}
          name={name}
          isActive={this.state.activeFilter}
          color={this.props.color}
        />
      );
    });
    return ListItems;
  };

  handleClick = (id, active) => {
    if (!active) {
      let index = this.props.player.queue.findIndex(track => {
        if ("track" in track) {
          track = track.track;
        }
        return track.id === id;
      });
      let currentSongs = this.props.player.queue
        .slice(index, this.props.player.queue.length)
        .map(track => {
          if ("track" in track) {
            track = track.track;
          }
          return track.uri;
        });
      let newItems = [];
      this.props.player.queue
        .slice(index, this.props.player.queue.length)
        .forEach((track, idx) => {
          // if ('track' in track) {
          // 	track = track.track;
          // }
          track.order = idx;
          track.album = {
            images: track.album.images
          };
          newItems.push(track);
        });
      this.props.ResetQueue(newItems);
      let uris = JSON.stringify([...currentSongs]);
      this.props.playSong(uris);
    } else if ((active, this.props.isPlaying === false)) {
      this.props.spotifyData.player.ResumePlayer();
    } else {
      this.props.spotifyData.player.StopPlayer();
    }
  };

  renderPlaylists = () => {
    let playlists = [];
    if (this.props.playlists !== undefined) {
      this.props.playlists.forEach((playlist, idx) => {
        playlists.push(
          <Playlist
            player={this.props.spotifyData.player}
            playlist={playlist}
            isPlaying={this.props.isPlaying}
            currentURI={this.props.currentURI}
            id={idx}
            key={idx}
            userId={this.props.user.id}
            playSong={this.props.playSong}
            ResetQueue={this.props.ResetQueue}
            getPlaylistTracks={this.props.getPlaylistTracks}
            rooms={this.state.rooms}
            toggleQ={this.props.toggleQ}
          />
        );
      });
    }
    return playlists;
  };
  buildStations = () => {
    const rooms = this.state.rooms.map((room, i) => {
      const isHost = this.props.user.id === Number(room.host.id);
      return (
        <Station
          {...room}
          key={i}
          isHost={isHost ? 1 : 0}
          setRoom={this.props.setRoom}
        />
      );
    });
    return rooms;
  };
  buildTracks = () => {
    let tracks = [];
    this.props.queue.forEach((track, idx) => {
      if ("track" in track) {
        track = track.track;
      }
      let active = this.props.currentURI === track.uri ? true : false;
      tracks.push(
        <Song
          key={`que-song-${idx}`}
          PlaySong={this.props.PlaySong}
          handleClick={this.handleClick}
          active={active}
          isPlaying={this.props.isPlaying}
          song={track}
          idx={idx}
        />
      );
    });
    return tracks;
  };

  render() {
    let playlists = [];
    let tracks = [];
    let stations = [];
    let queueStyle = {
      opacity: this.props.isActive ? 1 : 1,
      height: this.props.isActive ? "" : 0
    };
    let arrowStyle = {
      background: this.props.isActive ? "" : "transparent"
    };
    if (this.state.activeFilter === "Playlists") {
      playlists = this.renderPlaylists();
    } else if (this.state.activeFilter === "Queue") {
      tracks = this.buildTracks();
    } else if (this.state.activeFilter === "Stations" && this.state.rooms) {
      stations = this.buildStations();
    }
    let ListItems = this.getFilterItems();
    return (
      <div className="queue" style={queueStyle}>
        <div className="queue-header" style={queueStyle}>
          <div className="queue-list" style={queueStyle}>
            <ul>{ListItems}</ul>
          </div>
        </div>
        <div className="queue-playlist-holder">
          {playlists}
          {tracks}
          {stations}
        </div>
        <div
          className="downward-arrow"
          style={arrowStyle}
          onClick={() => this.props.toggleQ()}
        >
          <QueueMusicIcon
            style={{
              fontSize: "1.7em",
              color: this.props.color,
              borderRadius: "50px",
              boxShadow: "1px 1px 10px 1px rgba(0,0,0, 0.6)"
            }}
          />
        </div>
      </div>
    );
  }
}
const mapState = state => {
  return { ...state };
};
const mapDispatch = dispatch => {
  return {
    setRoom: payload => dispatch({ type: "SET_ROOM", payload })
  };
};
export default connect(mapState, mapDispatch)(withApollo(Queue));

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { ThumbUpRounded } from "@material-ui/icons";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ROOM, CREATE_LIKE } from "../../Apollo";
import SongsCarousel from "../Blocks/songs/SongsCarousel";
import SongFeatures from "../Blocks/songs/SongFeatures";

function Room(props) {
  const { player, user, spotifyData } = props;
  const [roomState, setRoomState] = useState({
    currentSong: {
      image: "",
      id: "",
      uri: "",
      name: "",
      artists: [],
      features: null
    },
    songs: []
  });
  useEffect(() => {
    const aborter = new AbortController();
    const songsFetcher = spotifyData.player
      .GetPlaylistTracks(user.room.spotifyId)
      .then(results => {
        const songs = results.items.map(e => {
          const res = e.track;
          let image = "/music-placeholder.png";
          if (res.album && res.album.images.length > 1) {
            image = res.album.images[1].url;
          } else if (res.album.images.length === 1) {
            image = res.album.image[0].url;
          }
          return {
            duration: res.duration_ms,
            artists: res.artists,
            name: res.name,
            image,
            id: res.id,
            uri: res.uri
          };
        });
        return songs;
      })
      .then(songs => {
        spotifyData.player
          .getTrackFeatures(`?ids=${songs.map(e => e.id)}`)
          .then(res => {
            const newSongs = songs.map((e, i) => {
              e.features = res["audio_features"][i];
              return e;
            });
            setRoomState(s => ({
              ...s,
              currentSong: { ...songs[0] },
              songs: newSongs
            }));
          });
      });
    return () => aborter.abort(songsFetcher);
  }, [setRoomState, user, spotifyData]);
  const id = Number(props.match.params.id);
  const [createLike, { data: likesData }] = useMutation(CREATE_LIKE);
  const { loading, error, data } = useQuery(GET_ROOM, {
    variables: { id },
    pollInterval: 0,
    fetchPolicy: "cache-and-network"
  });
  if (error) {
    return <MainRoom>Error</MainRoom>;
  }
  if (loading) {
    return (
      <MainRoom style={{ display: "flex", alignItems: "center" }}>
        <Loader loading={true} />
      </MainRoom>
    );
  }
  const { getRoom } = data;
  const { host, spotifyId } = getRoom;
  let messages = getRoom.messages.map(m => {
    return {
      author: m.user.username,
      message: m.message
    };
  });
  const likes = getRoom.likes.map(like => {
    return {
      spotifyId: like.spotifyId,
      userId: like.user.id,
      roomId: like.room.id
    };
  });

  const handleCreateLikeClick = (roomId, userId, spotifyId) => {
    const like = {
      roomId,
      userId,
      spotifyId
    };
    const idx = likes.findIndex(
      l => Number(l.userId) === userId && l.spotifyId === spotifyId
    );
    if (idx > -1) return;
    return createLike({ variables: { ...like } });
  };
  const buildHostInfo = () => {
    console.log(host);
  };
  const { currentSong } = roomState;
  const currentSongLikes = likes.filter(e => e.spotifyId === roomState.id)
    .length;
  return (
    <MainRoom color={player.colors.darkVibrant}>
      <div className="main_room_header">
        <h1>{user.room.roomName}</h1>
      </div>
      <div className="roomInfo">
        <HostInfo spotifyData={spotifyData} host={host} />
      </div>
      <div className="room-stats">
        <div className="room-songs" style={{ overflowY: "scroll" }}>
          <SongsCarousel
            {...{
              spotifyData,
              likes,
              id,
              user,
              handleCreateLikeClick,
              roomState,
              setRoomState
            }}
          />
        </div>
        <SongFeatures song={currentSong} color={player.colors.darkVibrant} />
      </div>
    </MainRoom>
  );
}

const HostInfo = ({ spotifyData, host }) => {
  const [state, setState] = useState({
    displayName: "",
    externalUrl: "",
    followers: 0,
    image: ""
  });
  useEffect(() => {
    spotifyData.player.getUserProfile(host.spotifyId).then(userData => {
      const image = userData.images.length
        ? userData.images[0].url
        : "https://avatars.dicebear.com/v2/initials/Na.svg?options[backgroundColors][]=grey&options[backgroundColorLevel]=500&options[fontSize]=29&options[bold]=1";
      const hostObject = {
        displayName: userData["display_name"],
        externalUrl: userData.externalUrl,
        followers: userData.followers.total,
        image: image
      };
      setState(hostObject);
    });
  }, [spotifyData, setState, host]);
  return (
    <>
      <div className="room-host">
        <h1>{state.displayName}</h1>
        <a className="host-avatar" href={state.externalUrl}>
          <img src={state.image} alt="" />
        </a>
        <h5>Followers {state.followers}</h5>
        <button className="host-follow-button">Follow</button>
      </div>
    </>
  );
};

const MainRoom = styled.div`
  width: 100vw;
  height: 90vh;
  margin: auto;
  padding: 30px;
  background: ${props =>
    `linear-gradient(160deg, ${props.color} 15%, rgba(0,0,0, 0.9) 70%)`};
  h1,
  h3,
  h5 {
    color: rgba(255, 255, 255, 0.75);
    line-height: 1em;
    margin: 0 1rem;
    font-size: 1rem;
    color: white;
    text-transform: capitalize;
    font-weight: 200;
  }
  h1 {
    margin: 2rem;
    font-size: 2rem;
    font-weight: 500;
  }
  .main_room_hero {
    display: flex;
    justify-content: space-between;
  }
  .song-block {
    width: 100%;
  }
  .roomInfo {
    display: flex;
  }
  .song-image {
    max-width: 60px;
    max-height: 60px;
    img {
      border-radius: 5px;
      height: 100%;
      width: 100%;
    }
  }
  .room-host {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    img {
      border-radius: 50%;
      width: 100px;
    }
    .host-follow-button {
      width: 200px;
      border: none;
      border-radius: 25px;
      padding: 10px 16px;
      background-color: #1db954;
      color: #191414;
      font-size: 1.5rem;
      line-height: 1rem;
      font-family: Helvetica;
      font-weight: bold;
    }
  }

  .room-stats {
    display: flex;
    height: 40vh;
    border-radius: 5px;
    .room-songs {
      flex-grow: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      align-self: flex-start;
      margin: 2em 1em;
      background-color: rgba(0, 0, 0, 0.5);
      .room-song {
        background-color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        display: flex;
        margin: 1px 1rem;
        width: 100%;
        justify-content: space-evenly;
        align-items: center;
        border-bottom: 1px solid #333;
        &.active {
          background-color: ${({ color }) => (color ? color : "red")};
        }
        .song-name {
          flex-grow: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          h3 {
            font-size: 1rem;
            font-weight: 200;
            width: 100px;
            &.name {
              width: fit-content;
              font-size: 1.5rem;
              font-weight: 300;
            }
          }
        }
      }
    }
  }

  .likes-container {
    height: 40%;
    width: 40%;
    margin: auto;
  }
`;

let Loader = ({ loading }) => {
  let display = loading ? "block" : "none";
  let loaderStyle = { display: display };
  return (
    <div className="loader" style={loaderStyle}>
      Loading...
    </div>
  );
};
const mapState = state => {
  return { ...state };
};
const mapDispatch = dispatch => {
  return {
    setRoom: payload => dispatch({ type: "SET_ROOM", payload })
  };
};
export default connect(mapState, mapDispatch)(Room);

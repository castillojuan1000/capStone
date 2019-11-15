import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { ThumbUpRounded } from "@material-ui/icons";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ROOM, CREATE_LIKE } from "../../Apollo";
import SongsCarousel from "../Blocks/songs/SongsCarousel";

function Room(props) {
  const { player, user, spotifyData } = props;
  const [roomState, setRoomState] = useState({
    currentSong: { image: "", id: "", uri: "", name: "", artists: [] },
    songs: []
  });
  useEffect(() => {
    const aborter = new AbortController();
    const songsFetcher = spotifyData.player
      .GetPlaylistTracks(user.room.spotifyId)
      .then(results => {
        const songs = results.items.map(e => {
          const res = e.track;
          const image = res.album["images"] ? res.album.images[1].url : "";
          return {
            artists: res.artists,
            name: res.name,
            image,
            id: res.id,
            uri: res.uri
          };
        });
        setRoomState(s => ({ ...s, songs: songs }));
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
        {/* <div className="likes-container">
        </div> */}
        <div className="currentSong-stats"></div>
        <div className="room-buttons">
          {currentSongLikes > 0 && (
            <div className="room-buttons-likes">{currentSongLikes}</div>
          )}
          <ThumbUpRounded
            style={{
              color: "#28a745",
              fontSize: "1.8em",
              marginLeft: "2px",
              cursor: "pointer"
            }}
            onClick={() => handleCreateLikeClick(id, user.id, roomState.id)}
          />
        </div>
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
    height: 25%;
  }
  .room-player {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2rem -2rem;
    .room-art-image {
      border-radius: 5px;
    }
  }
  .room-buttons {
    align-self: center;
    display: flex;
    align-items: center;
    .room-buttons-likes {
      font-weight: bold;
      font-size: 1rem;
      color: grey;
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
    flex-grow: 1;
    min-width: 40%;
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

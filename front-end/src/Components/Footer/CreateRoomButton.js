import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_ROOM } from "../../Apollo";
import { LiveTvRounded } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

function CreateRoomButton({
  userId,
  active,
  playlist,
  rooms,
  spotifyData,
  ResetQueue,
  history,
  toggleQ,
  setRoom
}) {
  const [createRoom] = useMutation(CREATE_ROOM);
  const handleClick = () => {
    const roomsArray = rooms.map(e => ({
      id: Number(e.id),
      hostId: e.host.id,
      roomName: e.roomName,
      spotifyId: e.spotifyId,
      room: { ...e }
    }));
    const newRoom = { hostId: userId, roomName: playlist.name };
    const idx = roomsArray.findIndex(
      e =>
        Number(e.hostId) === newRoom.hostId && e.roomName === newRoom.roomName
    );
    toggleQ();
    if (idx > -1) {
      const { id: roomId, spotifyId, host } = roomsArray[idx].room;
      debugger;
      setRoom({
        roomId,
        host,
        spotifyId
      });
      history.push(`/room/${roomId}`);
    } else {
      return createRoom({
        variables: {
          hostId: userId,
          roomName: playlist.name,
          spotifyId: playlist.id
        }
      }).then(({ data }) => {
        const { id: roomId, host, spotifyId } = data.createRoom;
        setRoom({
          roomId,
          host,
          spotifyId
        });
        history.push(`/room/${roomId}`);
      });
    }
  };
  return (
    <div
      className="start-station=btn"
      style={{
        display: active ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        color: "white"
      }}
      onClick={handleClick}
    >
      <LiveTvRounded style={{ fontSize: "1.5em" }} />
      Start Station from Playlist
    </div>
  );
}

const mapState = state => {
  return { ...state };
};
const mapDispatch = dispatch => {
  return {
    setRoom: payload => dispatch({ type: "SET_ROOM", payload })
  };
};

export default connect(mapState, mapDispatch)(withRouter(CreateRoomButton));

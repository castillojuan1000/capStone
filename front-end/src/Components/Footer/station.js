import React from "react";

import * as Vibrant from "node-vibrant";
import { withRouter } from "react-router-dom";
import { getColor } from "../../utilityFunctions/util.js";
class Station extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      colors: {
        DarkMuted: "black",
        Vibrant: "white",
        DarkVibrant: "red",
        LightVibrant: "green",
        Muted: "blue"
      }
    };
  }

  setColor = url => {
    let img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.addEventListener("load", () => {
      Vibrant.from(img).getPalette((err, palette) => {
        let colors = {
          Vibrant: getColor(palette, "Vibrant"),
          DarkMuted: getColor(palette, "DarkMuted"),
          DarkVibrant: getColor(palette, "DarkVibrant"),
          LightVibrant: getColor(palette, "LightVibrant"),
          Muted: getColor(palette, "Muted")
        };
        console.log(colors);
        this.setState({
          ...this.state,
          colors: colors
        });
      });
    });
  };

  setActive = () => {
    const {
      isHost,
      host,
      id: roomId,
      roomName,
      spotifyId,
      setRoom
    } = this.props;
    setRoom({ roomId, roomName, spotifyId, host: { isHost, ...host } });
    this.props.history.push("/room/" + roomId);
  };

  render = () => {
    const { playlist } = this.props;
    let image = "/music-placeholder.png";
    if (playlist.images.length === 1) {
      image = playlist.images[0].url;
    } else if (playlist.images.length > 1) {
      image = playlist.images[2].url;
    }
    let bodyStyle = { height: "0em", background: "rgba(0,0,0, 0)" };
    let containerStyle = {
      backgroundSize: "800vw 800vw",
      animation: "rotate 20s ease infinite"
      // background: `linear-gradient(160deg,
      //           ${this.state.colors.Vibrant},
      // 	${this.state.colors.DarkMuted})`,
      // border: this.props.isHost && "1px solid red"
    };
    return (
      <div
        style={containerStyle}
        className="playlist-section"
        onClick={() => this.setActive()}
      >
        <div className="queue-block" onClick={() => this.setActive()}>
          <div className="cover">
            <div className="playlist-image">
              <img
                src={image}
                alt={`artwork for the playlist ${this.props.roomName}`}
              />
            </div>
            <div className="playlist-name">
              {this.props.roomName.split("").length > 10 ? (
                <marquee direction="left" scrollamount="10" behavior="scroll">
                  <h1 id="playlist-name">{this.props.roomName}</h1>
                </marquee>
              ) : (
                <h1 id="playlist-name">{this.props.roomName}</h1>
              )}
            </div>
          </div>
        </div>
        <div className="playlist-body" style={bodyStyle}></div>
      </div>
    );
  };
}

export default withRouter(Station);

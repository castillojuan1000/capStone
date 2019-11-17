import React from "react";
import styled from "styled-components";
export default function SongFeatures(props) {
  const { song } = props;
  return (
    <SongFeaturesDiv>
      {song.features && (
        <>
          <div className="feature">
            <div className="song-danceability">
              <h3>Danceability</h3>
              <h3>{Math.round(song.features.danceability * 100)} %</h3>
            </div>
            <Bar>
              <Fill
                percentage={song.features.danceability * 100}
                color={props.color}
              />
            </Bar>
          </div>
          <div className="feature">
            <div className="song-energy">
              <h3>Energy</h3>
              <h3>{Math.round(song.features.energy * 100)} %</h3>
            </div>
            <Bar>
              <Fill
                percentage={song.features.energy * 100}
                color={props.color}
              />
            </Bar>
          </div>
        </>
      )}
    </SongFeaturesDiv>
  );
}

const SongFeaturesDiv = styled.div`
  margin: 2em;
  flex-grow: 1;
  width: 40%;
  height: 40%;
  .feature {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  .song-energy {
    display: flex;
    justify-content: space-between;
  }
  .song-danceability {
    display: flex;
    justify-content: space-between;
  }
`;

const Bar = styled.div`
  position: relative;
  height: 20px;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin: 1rem auto;
`;

const Fill = styled.div`
  background: ${({ color }) => (color ? color : "#0095da")};
  height: 100%;
  border-radius: inherit;
  transition: width 0.8s ease-in;
  width: ${props => `${props.percentage}%`};
`;

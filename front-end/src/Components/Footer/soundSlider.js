import React from 'react';
import { withStyles,  } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';


import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded';
import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';

const PrettoSlider = withStyles({
    root: {
      color: 'green',
      height: 4,
      width: '5vw',
    },
    thumb: {
      height: 15,
      width: 15,
      backgroundColor: 'white',
      color: 'red',
      border: '2px solid white',
      marginTop: -6,
      marginLeft: -5,
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
        backgroundColor: 'transparent',
        color: 'transparent',
      left: 'calc(-50% + 6px)',
      marginTop: 10,
    },
    track: {
      height: 4,
      width: '5vw',
      borderRadius: 4,
    },
    rail: {
      height: 4,
      width: '5vw',
      borderRadius: 4,
    },
  })(Slider);



let VolumeOn = ({ Muted, onClick, color }) => {
	let iconStyle = { fontSize: '1.6em', color: color, marginBottom: '-.1em'};
	return Muted ? (
		<VolumeOffRoundedIcon onClick={onClick} style={iconStyle} />
	) : (
		<VolumeUpRoundedIcon onClick={onClick} style={iconStyle} />
	);
};
  

  export default function SoundSlider( {toggleSound, muted, current, handleVolumeChange, height, ChangeVolume}) {
      let color = 'rgba(255,255,255, 0.8)';
      let orientation ='horizontal'
      let display = 'on'
      if (muted) {
        current = 0;
        display = 'off'
      }
      if (height < 1000) {
        orientation = 'vertical'
      } 
    return (
        <div className="volume-slider">
             <div className='play-holder vol-holder'>
                <VolumeOn
                    color={color}
                    onClick={() => toggleSound()}
                    Muted={muted}
                />
            </div>
            <PrettoSlider
                onChange={ChangeVolume}
                onChangeCommitted={({value}) => handleVolumeChange(value)}
                getAriaValueText={() => { return current}}
                getAriaLabel={() => {return current}}
                valueLabelDisplay={display} 
                valueLabelFormat={() => {return current}}
                aria-label="volume-slider" 
                orientation={orientation}
                style={{color: color}}value={current}
                max={100}
                min={0}
                defaultValue={current} 
                className="slider-guy"
                disabled={muted}
                />
        </div>
    );
  }
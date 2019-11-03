import React from 'react';
import { withStyles,  } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

import {getSongSeconds} from '../../utilityFunctions/util.js';




const PrettoSlider = withStyles({
    root: {
      color: 'green',
      height: 4,
      width: '50vw',
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
      width: '47vw',
      borderRadius: 4,
    },
    rail: {
      height: 4,
      width: '47vw',
      borderRadius: 4,
    },
  })(Slider);
  
  // function valuetext(value) {
  //   return `${value}°C`;
  // }

  export default function ProgressSlider( {max, current, color}) {
    let currentTime = getSongSeconds(current)
    let totalTime = getSongSeconds(max)
    if (currentTime === 'NaN:NaN') {
      currentTime = `00:00`;
      totalTime = `00:00`;
    }
    return (
        <div className="slider-holder">
            <div className="label current-label">
                <p>{currentTime}</p>
            </div>
            <PrettoSlider 
                getAriaValueText={() => { return currentTime}}
                getAriaLabel={() => {return currentTime}}
                valueLabelDisplay="off" 
                valueLabelFormat={() => {return currentTime}}
                aria-label="song-slider" 
                style={{color: color}}value={current}
                max={max} 
                min={0}
                defaultValue={current} 
                className="slider-guy"
                />
            <div className="label song-length">
                <p>{totalTime}</p>
            </div>
        </div>
    );
  }
import React from 'react';
import { withStyles,  } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

import {getSongSeconds} from '../../utilityFunctions/util.js';
import { pink } from '@material-ui/core/colors';
import { withTheme } from '@material-ui/styles';



const PrettoSlider = withStyles({
    root: {
      color: 'green',
      height: 4,
      width: '50vw',
    },
    thumb: {
      height: 0,
      width: 0,
      backgroundColor: 'transparent',
      color: 'transparent',
      border: '2px solid currentColor',
      marginTop: -4,
      marginLeft: 0,
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
        backgroundColor: 'transparent',
        color: 'transparent',
      left: 'calc(-50% + 4px)',
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
  

  export default function ProgressSlider( {max, current, color}) {

  
    return (
        <div className="slider-holder">
            <div className="label current-label">
                <p>{getSongSeconds(current)}</p>
            </div>
            <PrettoSlider aria-label="pretto slider" style={{color: color}}value={current} max={max} defaultValue={current} />
            <div className="label song-length">
                <p>{getSongSeconds(max)}</p>
            </div>
        </div>
    );
  }
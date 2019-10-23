import React from 'react';
import { withStyles,  } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

import {getSongSeconds} from '../../utilityFunctions/util.js';



const PrettoSlider = withStyles({
    root: {
      color: '#52af77',
      height: 4,
      width: '60vw',
    },
    thumb: {
      height: 14,
      width: 14,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -4,
      marginLeft: 0,
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 4,
      width: '57vw',
      borderRadius: 4,
    },
    rail: {
      height: 4,
      width: '57vw',
      borderRadius: 4,
    },
  })(Slider);
  

  export default function ProgressSlider( {max, current}) {

  
    return (
        <div className="slider-holder">
            <div className="label current-label">
                <p>{getSongSeconds(current)}</p>
            </div>
            <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" value={current} max={max} defaultValue={current} />
            <div className="label song-length">
                <p>{getSongSeconds(max)}</p>
            </div>
        </div>
    );
  }
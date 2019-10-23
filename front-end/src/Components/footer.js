import React from 'react';
import '../footer.css';
import {getCurrentlyPlaying, StopPlayer, ResumePlayer, getPlayer} from '../utilityFunctions/util.js';



import ArrowLeftRoundedIcon from '@material-ui/icons/ArrowLeftRounded';
import ArrowRightRoundedIcon from '@material-ui/icons/ArrowRightRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded';
import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';

import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';

import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';

import ProgressSlider from './Footer/progressSlider.js'


let Playing = ({IsPlaying}) => {
    let iconStyle = {fontSize: '2.5em'}
    return (IsPlaying) ? <PauseRoundedIcon style={iconStyle}/> : <PlayArrowRoundedIcon style={iconStyle}/>
}

let VolumeOn = ({Muted, onClick}) => {
    let iconStyle = {fontSize: '2em'}
    return (Muted) ? <VolumeOffRoundedIcon onClick={onClick} style={iconStyle}/> : <VolumeUpRoundedIcon onClick={onClick} style={iconStyle}/>
}

let LikeTrack = ({liked, onClick}) => {
    let iconStyle = {fontSize: '1.6em', paddingRight: '5%'}
    return (liked) ? <FavoriteRoundedIcon onClick={onClick} style={iconStyle}/> : <FavoriteBorderRoundedIcon onClick={onClick} style={iconStyle}/>
}

class Footer extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        playing: false,
        muted: false,
        liked: false,
        currentTime: 0,
        songLength: 321,
      }

    this.toggleSound = this.toggleSound.bind(this)
    this.toggleLike = this.toggleLike.bind(this)
    }

    startTimer() {
        this.setState({
          playing: true,
          currentTime: 0,
        })
        this.timer = setInterval(() => this.setState({
          currentTime: this.state.currentTime + 1,
        }), 1000);
      }
      stopTimer() {
        this.setState({...this.state, playing: false})
        clearInterval(this.timer)
      }
      resetTimer() {
        this.setState({...this.state, currentTime: 0})
      }


    togglePlay = () => {
        (!this.state.playing) ? this.startTimer() : this.stopTimer();
        (this.state.playing) ? StopPlayer() : ResumePlayer();
        this.setState({
            ...this.state,
            playing: !this.state.playing,
        })
    }

    toggleSound = () => {
        this.setState({
            ...this.state,
            muted: !this.state.muted,
        })
    }
    toggleLike = () => {
        this.setState({
            ...this.state,
            liked: !this.state.liked,
        })
    }

    componentDidMount() {
        getCurrentlyPlaying().then((result) => console.log(result));
        getPlayer().then((result) => console.log(result))
        }
  
    render() {
        let iconStyle = {fontSize: '4em'}
      return (
        <div className="footer">
            <div className="song-img">
                <img src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2017/12/attachment_68585523.jpg?auto=format&q=60&fit=max&w=930"></img>
            </div>
            <div className="player-section">
                <ArrowLeftRoundedIcon className="action-icon" style={iconStyle}/>
                <div className="play-holder" onClick={this.togglePlay}>
                    <Playing className="action-icon" IsPlaying={this.state.playing}/>
                </div>
                <ArrowRightRoundedIcon className="action-icon" style={iconStyle}/>
                <div className="play-holder vol-holder">
                    <VolumeOn onClick={this.toggleSound} Muted={this.state.muted}/>
                </div>
            </div>
            <div className="slider-section-container">
                <h3>Song Name </h3>
            <ProgressSlider current={this.state.currentTime} max={this.state.songLength}/>
                <h3>Artist Name</h3>
            </div>
            <div className="player-section">
                <div><LikeTrack liked={this.state.liked} onClick={this.toggleLike} className="action-icon"/></div>
                <div><MoreHorizRoundedIcon/></div>
            </div>

        </div>
      );
    }
  }

export default Footer
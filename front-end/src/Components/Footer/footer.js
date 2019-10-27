import React from 'react';
import '../../footer.css';
import {
	getCurrentlyPlaying,
	StopPlayer,
	ResumePlayer,
	AddSong,
	DeleteSong,
	ChangeVolume,
	PlayNext,
	PlayPrevious,
	RestartSong,
	TransferPlayback,
	getTrack
} from '../../utilityFunctions/util.js';
import { Link } from 'react-router-dom';

import ArrowLeftRoundedIcon from '@material-ui/icons/ArrowLeftRounded';
import ArrowRightRoundedIcon from '@material-ui/icons/ArrowRightRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded';
import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';

import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';

import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';

import RepeatRoundedIcon from '@material-ui/icons/RepeatRounded';
import SwapCallsRoundedIcon from '@material-ui/icons/SwapCallsRounded';

import ProgressSlider from './progressSlider.js';

import * as Vibrant from 'node-vibrant';
/* 
let BoxDemo = (url) => {
    let { data, loading, error } = usePalette(url)
    console.log(data)
    let divStyle = {width: '5vw', height: '5vw', backgroundColor: data.vibrant}
    return <div style={divStyle} ></div>
} */

let VolumeOn = ({ Muted, onClick }) => {
	let iconStyle = { fontSize: '2em' };
	return Muted ? (
		<VolumeOffRoundedIcon onClick={onClick} style={iconStyle} />
	) : (
		<VolumeUpRoundedIcon onClick={onClick} style={iconStyle} />
	);
};

let LikeTrack = ({ liked, onClick }) => {
	let iconStyle = { fontSize: '1.6em', paddingRight: '5%' };
	return liked ? (
		<FavoriteRoundedIcon onClick={onClick} style={iconStyle} />
	) : (
		<FavoriteBorderRoundedIcon onClick={onClick} style={iconStyle} />
	);
};

class Footer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			playing: false,
			muted: false,
			liked: false,
			currentTime: 0,
			songLength: 321
		};

		this.toggleSound = this.toggleSound.bind(this);
		this.toggleLike = this.toggleLike.bind(this);
		this.playNext = this.playNext.bind(this);
	}

	// class Footer extends React.Component {
	//     constructor(props){
	//       super(props)
	//       this.state = {
	//         playing: false,
	//         muted: false,
	//         liked: false,
	//         currentTime: 0,
	//         songLength: 321,
	//         vibrant: 'green',
	//       }

	//     this.toggleSound = this.toggleSound.bind(this)
	//     this.toggleLike = this.toggleLike.bind(this)
	//     this.playNext = this.playNext.bind(this)
	//     this.setColor = this.setColor.bind(this)
	//     }

	startTimer(currentTime = 0) {
		this.setState({
			playing: true,
			currentTime: currentTime
		});
		this.timer = setInterval(
			() =>
				this.setState({
					currentTime: this.state.currentTime + 0.25
				}),
			250
		);
	}
	stopTimer() {
		this.setState({ ...this.state, playing: false });
		clearInterval(this.timer);
	}
	resetTimer() {
		this.setState({ ...this.state, currentTime: 0 });
	}

	playNext(next = true) {
		let action;
		if (next === false && this.state.currentTime < 10) {
			this.resetTimer();
			action = PlayPrevious();
		} else if (next === true) {
			this.resetTimer();
			action = PlayNext();
		}
		if (action !== undefined) {
			action.then(success => {
				getCurrentlyPlaying().then(result => {
					console.log(this.state);
					this.setState({
						...this.state,
						currentSong: result.item.uri,
						artist: result.item.artists[0].name,
						songLength: result.item.duration_ms / 1000,
						currentTime: result.progress_ms / 1000,
						songImg: result.item.album.images[2].url,
						albumName: result.item.album.name,
						songName: result.item.name,
						playing: result.is_playing,
						init: true
					});
				});
			});
		} else if (this.state.currentTime > 10 && next == false) {
			this.resetTimer();
			RestartSong();
		}
	}

	togglePlay = (init = false) => {
		!this.state.playing
			? this.startTimer(this.state.currentTime)
			: this.stopTimer();
		this.state.playing ? StopPlayer() : ResumePlayer();
		this.setState({
			...this.state,
			playing: !this.state.playing,
			init: false
		});
	};

	toggleSound = () => {
		this.state.muted ? ChangeVolume(100) : ChangeVolume(0);
		this.setState({
			...this.state,
			muted: !this.state.muted
		});
	};
	toggleLike = () => {
		this.props.player.spotify.getCurrentlyPlaying().then(console.log);
		///AddSong(this.state.currentSong) : DeleteSong(this.state.currentSong)
		!this.state.liked
			? AddSong([this.state.currentSongId])
			: DeleteSong([this.state.currentSongId]);
		this.setState({
			...this.state,
			liked: !this.state.liked
		});
	};

	setColor = url => {
		let _ = this;
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = url;
		img.addEventListener('load', function() {
			Vibrant.from(img).getPalette((err, palette) => {
				let rgb = palette.Vibrant._rgb;
				let color = `RGBA(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
				_.setState({
					...this.state,
					vibrant: color
				});
			});
		});
	};

	componentDidMount() {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const token = localStorage.getItem('token');
			const player = new window.Spotify.Player({
				name: 'Sound Good Music',
				getOAuthToken: cb => {
					cb(token);
				}
			});
			player.addListener('player_state_changed', state => {
				console.log('new state', state);
				if (
					this.state.songImg !==
					state.track_window.current_track.album.images[2].url
				) {
					getTrack(state.track_window.current_track.id).then(result => {
						this.setState({
							...this.state,
							albumId: result.album.id
						});
					});
					this.setColor(state.track_window.current_track.album.images[2].url);
				}
				this.setState({
					...this.state,
					currentSong: state.track_window.current_track.uri,
					currentSongId: state.track_window.current_track.id,
					artist: state.track_window.current_track.artists[0].name,
					songLength: state.track_window.current_track.duration_ms / 1000,
					currentTime: state.position / 1000,
					songImg: state.track_window.current_track.album.images[2].url,
					albumName: state.track_window.current_track.album.name,
					songName: state.track_window.current_track.name,
					playing: !state.paused
				});
			});
			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				TransferPlayback(device_id);
			});
			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});
			player.connect();
		};
	}

	render() {
		//let footerStyle = {backgroundImage: `url(${this.state.songImg})`,  backgroundSize: 'cover'}
		let iconStyle = { fontSize: '4em' };
		return (
			<div className='footer'>
				<div className='song-info'>
					<div className='song-img'>
						<img id='currently-playing' src={this.state.songImg}></img>
					</div>
					<div className='title-holder'>
						<Link className='album-link' to={'/album/' + this.state.albumId}>
							<h3>{this.state.songName}</h3>
						</Link>
						<h6>{this.state.artist}</h6>
					</div>
				</div>
				<div className='slider-section-container'>
					<div className='player-section'>
						<div className='like-holder'>
							<LikeTrack
								liked={this.state.liked}
								onClick={this.toggleLike}
								className='action-icon'
							/>
						</div>
						<div>
							<MoreHorizRoundedIcon />
						</div>
						<div className='main-play-buttons'>
							<div>
								<SwapCallsRoundedIcon
									style={{
										fontSize: '1.7em',
										marginRight: '1.5em',
										color: 'rgba(255,255,255, 0.6)'
									}}
									className='action-icon'
								/>
							</div>
							<ArrowLeftRoundedIcon
								onClick={() => this.playNext(false)}
								className='action-icon'
								style={iconStyle}
							/>
							<div
								className='play-holder'
								style={{
									border: '1px solid rgba(255,255,255, 0.4)',
									borderRadius: '50px',
									width: '2.15em',
									padding: '.1em',
									height: '2.15em'
								}}
								onClick={this.togglePlay}>
								<PlayArrowRoundedIcon
									className='action-icon'
									IsPlaying={this.state.playing}
								/>
							</div>
							<ArrowRightRoundedIcon
								onClick={() => this.playNext(true)}
								className='action-icon'
								style={iconStyle}
							/>
							<div>
								<RepeatRoundedIcon
									style={{
										fontSize: '1.7em',
										marginLeft: '1.5em',
										color: 'rgba(255,255,255, 0.6)'
									}}
									className='action-icon'
								/>
							</div>
						</div>
						<div className='play-holder vol-holder'>
							<VolumeOn onClick={this.toggleSound} Muted={this.state.muted} />
						</div>
					</div>
					<ProgressSlider
						color={this.state.vibrant}
						current={this.state.currentTime}
						max={this.state.songLength}
					/>
				</div>
				<div className='player-section'></div>
			</div>
		);
	}
}

export default Footer;

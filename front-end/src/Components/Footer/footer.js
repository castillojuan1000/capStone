import React from 'react';
import '../../footer.css';
import {
	ChangeVolume,
	PlayNext,
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
import { stat } from 'fs';

import Script from 'react-load-script'


async function waitForSpotifyWebPlaybackSDKToLoad () {
	return new Promise(resolve => {
	  if (window.Spotify) {
		resolve(window.Spotify);
	  } else {
		window.onSpotifyWebPlaybackSDKReady = () => {
		  resolve(window.Spotify);
		};
	  }
	});
  };



let VolumeOn = ({ Muted, onClick, color }) => {
	let iconStyle = { fontSize: '2em', color: color };
	return Muted ? (
		<VolumeOffRoundedIcon onClick={onClick} style={iconStyle} />
	) : (
		<VolumeUpRoundedIcon onClick={onClick} style={iconStyle} />
	);
};

let IsPlaying = ({ IsPlaying, color }) => {
	let iconStyle = { fontSize: '2em', color: color };
	return IsPlaying ? (
		<PauseRoundedIcon style={iconStyle} />
	) : (
		<PlayArrowRoundedIcon style={iconStyle} />
	);
};

let LikeTrack = ({ liked, onClick, color }) => {
	let iconStyle = { fontSize: '1.6em', paddingRight: '5%', color: color };
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
			playing: this.props.player.isPlaying,
			muted: false,
			liked: false,
			loaded: false,
			currentTime: this.props.player.currentTime,
			songLength: this.props.player.songLength,
		};

		this.toggleSound = this.toggleSound.bind(this);
		this.toggleLike = this.toggleLike.bind(this);
		this.playNext = this.playNext.bind(this);
		this.setupSpotifyPlayer = this.setupSpotifyPlayer.bind(this);
		this.setTabID = this.setTabID.bind(this);
		this.handleScriptMount = this.handleScriptMount.bind(this)
	}

	startTimer(currentTime = 0) {
		this.timer = setInterval(() => this.props.setCurrentTime(), 250);
	}
	stopTimer() {
		clearInterval(this.timer);
	}
	resetTimer() {
		this.setState({ ...this.state, currentTime: 0 });
	}

	playNext(next = true) {
		const {
			PlayPrevious,
			getCurrentlyPlaying,
			RestartSong
		} = this.props.spotifyData.player;
		let action;
		if (next === false && this.props.player.currentTime < 10) {
			this.resetTimer();
			action = PlayPrevious();
		} else if (next === true) {
			this.resetTimer();
			action = this.props.spotifyData.player.PlayNext();
		}
		if (action !== undefined) {
			action.then(success => {
				getCurrentlyPlaying().then(result => {
					//this.props.spotifyData.player.PlayNext(result)
					this.setState({
						...this.state,
						init: true
					});
				});
			});
		} else if (this.props.player.currentTime > 4 && next == false) {
			this.resetTimer();
			RestartSong();
		}
	}

	togglePlay = (init = false) => {
		console.log(this.props.spotifyData.player);
		const {
			togglePlay,
			StopPlayer,
			ResumePlayer
		} = this.props.spotifyData.player;
		!this.props.player.isPlaying
			? this.startTimer(this.props.player.currentTime)
			: this.stopTimer();
		this.props.player.isPlaying ? StopPlayer() : ResumePlayer();
		this.props.togglePlay();
	};

	toggleSound = () => {
		this.state.muted ? ChangeVolume(100) : ChangeVolume(0);
		this.setState({
			...this.state,
			muted: !this.state.muted
		});
	};
	toggleLike = () => {
		let {AddSong, getCurrentlyPlaying, DeleteSong} = this.props.spotifyData.player;
		getCurrentlyPlaying().then(console.log);
		!this.state.liked
			? AddSong([this.props.player.currentSongId])
			: DeleteSong([this.props.player.currentSongId]);
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

	handleScriptMount(){
		//alert(1)
		(async () => {
			const { Player } = await waitForSpotifyWebPlaybackSDKToLoad();
			this.setupSpotifyPlayer()
		  })();
}

	setupSpotifyPlayer() {
		console.log('spotify', window.Spotify)
			let {TransferPlayback, getTrack, getPlayer} = this.props.spotifyData.player;
			const token = this.props.spotifyData.userToken;
			const player = new window.Spotify.Player({
				name: `Sound Good Music ${Math.floor(Math.random() * 10)}`,
				getOAuthToken: cb => {
					cb(token);
				}
			});
			console.debug('debug', player)
			player.addListener('player_state_changed', state => {
				console.debug('new state', state);
				let action = (state === null) ? window.close() : null;
				if (
					action === null &&
					this.props.player.songImg !==
					state.track_window.current_track.album.images[2].url
				) {
					getTrack(state.track_window.current_track.id).then(result => {
						document.title = `${state.track_window.current_track.name} · ${result.artists[0].name}`;
						this.props.playerSetArtistID({
							albumId: result.album.id,
							artistId: result.artists[0].id
						});
					});
					this.setColor(state.track_window.current_track.album.images[2].url);
				}
				if (action === null) {
					this.props.playerStateChange(state)
				}
			});
			player.addListener('ready', ({ device_id }) => {
				getPlayer().then(player => console.info(player))
				console.debug('Ready with Device ID', device_id);
				TransferPlayback(device_id).then(data => {
					console.info(data)
					this.props.spotifyData.player.ResumePlayer().then((data) => console.info('start playing' ,data))
				});
			});
			player.addListener('not_ready', ({ device_id }) => {
				console.debug('Device ID has gone offline', device_id);
			});
			player.on('initialization_error', ({ message }) => {
				console.debug('Failed to initialize', message);
			  });
			this.setTabID()
			window.addEventListener('storage', () => {
				alert(2)
				let item = (this.state.currentTab !== localStorage.getItem("tabID")
				) ? player.disconnect().then(() => window.close()): '';
			   });
			player.connect().then(() => {player.resume()});
			player.setName(`Sound Good Music ${Math.floor(Math.random() * 10)}`)
	}

	setTabID = () => {
		var iPageTabID = sessionStorage.getItem("tabID");
		if (iPageTabID == null){
			var iLocalTabID = localStorage.getItem("tabID");
			var iPageTabID = (iLocalTabID == null) ? 1 : Number(iLocalTabID) + 1;
			localStorage.setItem("tabID",iPageTabID);
			sessionStorage.setItem("tabID",iPageTabID);
			this.setState({
				...this.state,
				currentTab: iPageTabID,
			})
			}
	}

	render() {
		//let footerStyle = {backgroundImage: `url(${this.state.songImg})`,  backgroundSize: 'cover'}
		let iconStyle = { fontSize: '4em' };
		return (
			<div className='footer'>
				<div className='song-info'>
					<div className='song-img'>
						<img id='currently-playing' src={this.props.player.songImg}></img>
					</div>
					<div className='title-holder'>
						<Link
							className='album-link'
							to={'/album/' + this.props.player.albumId}>
							<h3>{this.props.player.songName}</h3>
						</Link>
						<Link
							className='album-link'
							to={{ pathname: '/artist/' + this.props.player.artistId }}>
							<h6>{this.props.player.artist}</h6>
						</Link>
					</div>
				</div>
				<div className='slider-section-container'>
					<div className='player-section'>
						<div className='like-holder'>
							<LikeTrack
								liked={this.state.liked}
								onClick={this.toggleLike}
								className='action-icon'
								color={this.state.vibrant}
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
								color={this.state.vibrant}
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
								<IsPlaying
									className='action-icon'
									IsPlaying={this.props.player.isPlaying}
									color={this.state.vibrant}
								/>
							</div>
							<ArrowRightRoundedIcon
								onClick={() => this.playNext(true)}
								className='action-icon'
								color={this.state.vibrant}
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
							<VolumeOn
								color={this.state.vibrant}
								onClick={this.toggleSound}
								Muted={this.state.muted}
							/>
						</div>
					</div>
					<Script
						url="https://sdk.scdn.co/spotify-player.js"
						onLoad={this.handleScriptMount}
					/>
					<ProgressSlider
						color={this.state.vibrant}
						current={this.props.player.currentTime}
						max={this.props.player.songLength}
					/>
				</div>
				<div className='player-section'></div>
			</div>
		);
	}
}

export default Footer;

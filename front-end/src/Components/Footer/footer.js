import React from 'react';
import '../../footer.css';
import { ChangeVolume, getColor } from '../../utilityFunctions/util.js';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import ProgressSlider from './progressSlider.js';
import SoundSlider from './soundSlider.js';
import Queue from './queue';
import {
	SwapCallsRounded,
	RepeatRounded,
	FavoriteRounded,
	ArrowLeftRounded,
	ArrowRightRounded,
	PauseRounded,
	PlayArrowRounded,
	MoreHorizRounded,
	FavoriteBorderRounded,
	Sync,
	SyncDisabledRounded,
	SettingsInputComponentRounded
} from '@material-ui/icons';
import * as Vibrant from 'node-vibrant';

import Script from 'react-load-script';

let Alert = ({ colors }) => {
	let backStyle = {
		background: `linear-gradient(45deg, ${colors.vibrant} 15%,  rgba(255,255,255, 1) 70%)`
	};
	return (
		<div className='alert' style={backStyle}>
			<div className='alert-inner'>
				<div className='alert-header'>
					<h2>Sucess Song Added to Likes</h2>
				</div>
			</div>
		</div>
	);
};

async function waitForSpotifyWebPlaybackSDKToLoad() {
	return new Promise(resolve => {
		if (window.Spotify) {
			resolve(window.Spotify);
		} else {
			window.onSpotifyWebPlaybackSDKReady = () => {
				resolve(window.Spotify);
			};
		}
	});
}

let IsPlaying = ({ IsPlaying, color }) => {
	let iconStyle = { fontSize: '2em', color: color };
	return IsPlaying ? (
		<PauseRounded style={iconStyle} />
	) : (
			<PlayArrowRounded style={iconStyle} />
		);
};

let LikeTrack = ({ liked, onClick, color }) => {
	let iconStyle = { fontSize: '1.6em', paddingRight: '5%', color: color };
	return liked ? (
		<FavoriteRounded onClick={onClick} style={iconStyle} />
	) : (
			<FavoriteBorderRounded onClick={onClick} style={iconStyle} />
		);
};

class Footer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			height: window.innerWidth,
			colors: {},
			playing: this.props.player.isPlaying,
			muted: false,
			liked: false,
			loaded: false,
			currentTime: 0,
			volume: 100,
			QueueActive: false,
			songLength: this.props.player.songLength,
			pageOn: false
		};
		this.toggleSound = this.toggleSound.bind(this);
		this.toggleLike = this.toggleLike.bind(this);
		this.toggleQueue = this.toggleQueue.bind(this);
		this.playNext = this.playNext.bind(this);
		this.setupSpotifyPlayer = this.setupSpotifyPlayer.bind(this);
		this.setTabID = this.setTabID.bind(this);
		this.handleScriptMount = this.handleScriptMount.bind(this);
		this.startTimer = this.startTimer.bind(this);
		this.setColor = this.setColor.bind(this);
		// *** SOCKET CONNECTION TO SYNC WITH HOST
		this.socket = io('/');
		this.socket.on('SYNC_PLAYER', data => {
			const { user } = this.props;
			const { room } = user;
			if (
				room &&
				data.roomId === room.roomId &&
				user.id === Number(data.hostId)
			) {
				const { socketId } = data;
				const hostPlayer = {
					...this.props.player,
					currentTime: this.state.currentTime
				};
				sendPlayerState(socketId, hostPlayer);
			}
		});
		this.socket.on('RECEIVE_PLAYER_STATE', data => {
			const { player: hostPlayer, roomId, socketId } = data;
			if (this.props.user.room && this.props.user.room.subscribed && roomId) {
				this.props.setPlayer(hostPlayer);
				this.props.spotifyData.player
					.playSong(JSON.stringify(hostPlayer.queue.map(s => s.uri)))
					.then(() => {
						this.props.spotifyData.player
							.SeekSong(hostPlayer.currentTime * 1000)
							.then(() => {
								this.props.ResetQueue(hostPlayer.queue);
							});
					});
			} else if (this.socket.id === socketId) {
				this.props.setPlayer(hostPlayer);
				this.props.spotifyData.player
					.playSong(JSON.stringify(hostPlayer.queue.map(s => s.uri)))
					.then(() => {
						this.props.spotifyData.player
							.SeekSong(hostPlayer.currentTime * 1000)
							.then(() => {
								this.props.ResetQueue(hostPlayer.queue);
							});
					});
			}
		});
		const sendPlayerState = (socketId, player) => {
			this.socket.emit('SEND_PLAYER_STATE', { socketId, player });
			if (!socketId) {
				this.socket.emit('SEND_PLAYER_STATE', {
					roomId: this.props.user.room.roomId,
					player
				});
			}
		};
	}
	sendStateFromHost = () => {
		this.socket.emit('SEND_PLAYER_STATE', {
			roomId: this.props.user.room.roomId,
			player: this.props.player
		});
	};
	updateDimensions = () => {
		this.setState({
			...this.state,
			height: window.innerWidth
		});
	};

	componentDidMount = () => {
		window.addEventListener('resize', this.updateDimensions.bind(this));
	};

	componentWillUnmount = () => {
		window.removeEventListener('resize', this.updateDimensions.bind(this));
	};
	requestPlayerState = socketId => {
		console.log(socketId);
		const { user } = this.props;
		const { room } = user;
		debugger;
		this.socket.emit('REQUEST_PLAYER_STATE', {
			socketId,
			roomId: room.roomId,
			hostId: room.host.id
		});
	};

	startTimer(currentTime = 0) {
		this.stopTimer();
		this.setState({
			...this.state,
			currentTime: currentTime,
			timer: setInterval(() => {
				this.setState({
					...this.state,
					currentTime: this.state.currentTime + 0.25
				});
			}, 250)
		});
	}
	stopTimer() {
		clearInterval(this.state.timer);
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
		if (next === false && this.state.currentTime < 4) {
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
		} else if (this.state.currentTime > 4 && next === false) {
			this.resetTimer();
			RestartSong();
		}
	}
	toggleQueue = () => {
		this.setState({
			...this.state,
			QueueActive: !this.state.QueueActive
		});
	};

	ChangeVolume = (event, value) => {
		this.setState({
			...this.state,
			volume: value
		});
	};

	handleVolumeChange = (event, value) => {
		ChangeVolume(this.state.volume);
	};

	ChangeTime = (event, value) => {
		this.setState({
			...this.state,
			currentTime: value
		});
	};

	handleTimeChange = (event, value) => {
		this.props.spotifyData.player.SeekSong(this.state.currentTime * 1000);
	};

	togglePlay = (init = false) => {
		const { StopPlayer, ResumePlayer } = this.props.spotifyData.player;
		this.props.player.isPlaying ? StopPlayer() : ResumePlayer();
		this.props.togglePlay();
	};

	toggleShuffle = () => {
		const { EnableShuffleMode } = this.props.spotifyData.player;
		EnableShuffleMode(!this.props.player.shuffle);
	};

	toggleRepeat = () => {
		const context = this.props.player.repeat ? 'off' : 'context';
		const { EnableRepeatMode } = this.props.spotifyData.player;
		EnableRepeatMode(context);
	};

	toggleSound = () => {
		this.state.muted ? ChangeVolume(this.state.volume) : ChangeVolume(0);
		this.setState({
			...this.state,
			muted: !this.state.muted
		});
	};
	toggleLike = () => {
		let {
			AddSong,
			getCurrentlyPlaying,
			DeleteSong
		} = this.props.spotifyData.player;
		getCurrentlyPlaying();
		let NewLike = this.state.liked ? false : true;
		!this.state.liked
			? AddSong([this.props.player.currentSongId]).then(result => {
				setTimeout(() => {
					this.setState({
						...this.state,
						NewLike: false
					});
				}, 2500);
			})
			: DeleteSong([this.props.player.currentSongId]);
		this.setState({
			...this.state,
			liked: !this.state.liked,
			NewLike: NewLike
		});
	};

	setColor = url => {
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = url;
		img.addEventListener(
			'load',
			function () {
				Vibrant.from(img).getPalette((err, palette) => {
					//console.error(err)
					let color = getColor(palette, 'Vibrant');
					let colors = {
						vibrant: color,
						darkMuted: getColor(palette, 'DarkMuted'),
						darkVibrant: getColor(palette, 'DarkVibrant'),
						lightVibrant: getColor(palette, 'LightVibrant'),
						muted: getColor(palette, 'Muted')
					};
					this.props.SetColors(colors);
					this.setState({
						...this.state,
						Vibrant: color,
						colors: colors
					});
				});
			}.bind(this)
		);
	};

	handleScriptMount() {
		(async () => {
			await waitForSpotifyWebPlaybackSDKToLoad();
			this.setupSpotifyPlayer();
		})();
	}

	setupSpotifyPlayer() {
		let { TransferPlayback, getTrack } = this.props.spotifyData.player;
		const token = this.props.spotifyData.userToken;
		this.setTabID();
		const player = new window.Spotify.Player({
			name: `Sound Good Music ${Math.floor(Math.random() * 10)}`,
			getOAuthToken: cb => {
				cb(token);
			}
		});
		player.addListener('player_state_changed', state => {
			console.debug('new state', state);

			let action = state === null ? window.close() : null;
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
				!state.paused
					? this.startTimer(state.position / 1000)
					: this.stopTimer();
				this.props.playerStateChange(state);
			}
		});
		player.addListener('ready', ({ device_id }) => {
			console.debug('Ready with Device ID', device_id);
			TransferPlayback(device_id).then(data => {
				this.props.spotifyData.player.ResumePlayer();
			});
		});
		player.addListener('not_ready', ({ device_id }) => {
			console.debug('Device ID has gone offline', device_id);
		});
		player.on('initialization_error', ({ message }) => {
			console.debug('Failed to initialize', message);
		});
		window.addEventListener('storage', () => {
			this.state.currentTab !== localStorage.getItem('tabID') &&
				player.disconnect().then(() => window.close());
		});
		player.connect().then(() => {
			player.resume();
		});
		player.setName(`Sound Good Music ${Math.floor(Math.random() * 10)}`);
		this.props.spotifyData.player.GetMyPlaylists().then(data => {
			this.setState({
				...this.state,
				playlists: data.items
			});
		});
	}

	setTabID = () => {
		var iPageTabID = sessionStorage.getItem('tabID');
		if (iPageTabID === null) {
			var iLocalTabID = localStorage.getItem('tabID');
			iPageTabID = iLocalTabID == null ? 1 : Number(iLocalTabID) + 1;
			localStorage.setItem('tabID', iPageTabID);
			sessionStorage.setItem('tabID', iPageTabID);
			this.setState({
				...this.state,
				currentTab: iPageTabID
			});
		}
	};

	updatePageOn = pageOn => {
		this.setState({
			...this.state,
			pageOn: pageOn
		});
	};

	render() {
		var item = ['album', 'artist', 'playlist'];
		var location = this.props.location.pathname.split('/')[1];
		let status = item.indexOf(location) > -1 ? true : false;
		status !== this.state.pageOn && this.updatePageOn(status);
		let scriptTag = [];
		if (window.Spotify === undefined) {
			scriptTag = [
				<Script
					key={1}
					url='https://sdk.scdn.co/spotify-player.js'
					onLoad={this.handleScriptMount}
				/>
			];
		}
		//let footerStyle = {backgroundImage: `url(${this.state.songImg})`,  backgroundSize: 'cover'}
		let iconStyle = { fontSize: '4em' };
		let alert = this.state.NewLike ? (
			<Alert
				img={this.props.player.songImg}
				color={
					this.pageOn
						? this.props.player.secondaryColors.Vibrant
						: this.props.player.colors.vibrant
				}
				songName={this.props.player.songName}
				artistName={this.props.player.artist}
				colors={this.state.colors}
			/>
		) : (
				''
			);
		return (
			<div className='footer'>
				<Queue
					color={
						this.pageOn
							? this.props.player.secondaryColors.Vibrant
							: this.props.player.colors.vibrant
					}
					isActive={this.state.QueueActive}
					toggleQ={this.toggleQueue}
					playlists={this.state.playlists}
					queue={this.props.player.queue}
					currentURI={this.props.player.currentSong.uri}
					isPlaying={this.props.player.isPlaying}
					ResetQueue={this.props.ResetQueue}
					player={this.props.spotifyData.player}
					playSong={
						this.props.spotifyData.player
							? this.props.spotifyData.player.playSong
							: null
					}
					getPlaylistTracks={
						this.props.spotifyData.player
							? this.props.spotifyData.player.GetPlaylistTracks
							: null
					}
				/>

				{alert}
				<div className='song-info'>
					<div className='song-img'>
						<img
							id='currently-playing'
							alt='currently playing song'
							src={this.props.player.songImg}></img>
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
								color={
									this.pageOn
										? this.props.player.secondaryColors.Vibrant
										: this.props.player.colors.vibrant
								}
							/>
						</div>
						<div className='more-icon'>
							<MoreHorizRounded />
						</div>
						<div className='main-play-buttons'>
							<div className='swap-icon'>
								<SwapCallsRounded
									onClick={this.toggleShuffle}
									style={{
										fontSize: '1.7em',
										marginRight: '1.5em',
										color: this.props.player.shuffle
											? this.pageOn
												? this.props.player.secondaryColors.Vibrant
												: this.props.player.colors.vibrant
											: 'rgba(255,255,255, 0.4)',
										borderBottom: this.props.player.shuffle
											? `2px solid ${
											this.pageOn
												? this.props.player.secondaryColors.Vibrant
												: this.props.player.colors.vibrant
											}`
											: '2px solid transparent',
										borderRadius: '50px',
										boxShadow: '1px 1px 10px 1px rgba(0,0,0, 0.6)'
									}}
									className='action-icon'
								/>
							</div>
							<ArrowLeftRounded
								onClick={() => this.playNext(false)}
								className='action-icon'
								style={{
									...iconStyle,
									color:
										this.props.player.previousBtn || this.state.currentTime > 4
											? 'white'
											: 'rgba(255,255,255,0.2)',
									cursor:
										this.props.player.previousBtn || this.state.currentTime > 4
											? 'pointer'
											: 'not-allowed'
								}}
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
									color={
										this.pageOn
											? this.props.player.secondaryColors.Vibrant
											: this.props.player.colors.vibrant
									}
								/>
							</div>
							<ArrowRightRounded
								onClick={() => this.playNext(true)}
								className='action-icon'
								style={iconStyle}
							/>
							<div className='repeat-icon'>
								<RepeatRounded
									onClick={this.toggleRepeat}
									style={{
										fontSize: '1.7em',
										marginLeft: '1.5em',
										color: this.props.player.repeat
											? this.pageOn
												? this.props.player.secondaryColors.Vibrant
												: this.props.player.colors.vibrant
											: 'rgba(255,255,255, 0.4)',
										borderBottom: this.props.player.repeat
											? `2px solid ${
											this.pageOn
												? this.props.player.secondaryColors.Vibrant
												: this.props.player.colors.vibrant
											}`
											: '2px solid transparent',
										borderRadius: '50px',
										boxShadow: '1px 1px 10px 1px rgba(0,0,0, 0.6)'
									}}
									className='action-icon'
								/>
							</div>
						</div>
						<div className='play-holder vol-holder'>
							{/* {This checks if the current user is in a room & they are not the host!} */}
						</div>
					</div>
					{scriptTag}
					<ProgressSlider
						color={
							this.pageOn
								? this.props.player.secondaryColors.Vibrant
								: this.props.player.colors.vibrant
						}
						ChangeTime={this.ChangeTime}
						handleTimeChange={this.handleTimeChange}
						current={this.state.currentTime}
						max={this.props.player.songLength}
						height={this.state.height}
					/>
				</div>
				<div className='icon-section'>
					{this.props.user.room &&
						!this.props.user.room.host.isHost &&
						(this.props.user.room.subscribed ? (
							<Sync
								onClick={() => {
									this.props.setRoom({
										subscribed: !this.props.user.room.subscribed
									});
									this.requestPlayerState(this.socket.id);
								}}
								style={{
									fontSize: '1.7em',
									marginLeft: '1.5em',
									color: this.pageOn
										? this.props.player.secondaryColors.Vibrant
										: this.props.player.colors.vibrant,
									borderBottom: this.props.player.repeat
										? `2px solid ${
										this.pageOn
											? this.props.player.secondaryColors.Vibrant
											: this.props.player.colors.vibrant
										}`
										: '2px solid transparent',
									borderRadius: '50px',
									boxShadow: '1px 1px 10px 1px rgba(0,0,0, 0.6)'
								}}
							/>
						) : (
								<SyncDisabledRounded
									onClick={() => {
										if (this.props.user.room) {
											this.props.setRoom({
												subscribed: !this.props.user.room.subscribed
											});
											this.requestPlayerState(this.socket.id);
										}
									}}
									style={{
										fontSize: '1.7em',
										marginLeft: '1.5em',
										color: this.pageOn
											? this.props.player.secondaryColors.Vibrant
											: this.props.player.colors.vibrant,
										borderBottom: this.props.player.repeat
											? `2px solid ${
											this.pageOn
												? this.props.player.secondaryColors.Vibrant
												: this.props.player.colors.vibrant
											}`
											: '2px solid transparent',
										borderRadius: '50px',
										boxShadow: '1px 1px 10px 1px rgba(0,0,0, 0.6)'
									}}
								/>
							))}
					{this.props.user.room && this.props.user.room.host.isHost && (
						<SettingsInputComponentRounded
							onClick={this.sendStateFromHost}
							style={{
								fontSize: '1.7em',
								marginLeft: '1.5em',
								color: this.pageOn
									? this.props.player.secondaryColors.Vibrant
									: this.props.player.colors.vibrant,
								borderBottom: this.props.player.repeat
									? `2px solid ${
									this.pageOn
										? this.props.player.secondaryColors.Vibrant
										: this.props.player.colors.vibrant
									}`
									: '2px solid transparent',
								borderRadius: '50px',
								boxShadow: '1px 1px 10px 1px rgba(0,0,0, 0.6)'
							}}
						/>
					)}
				</div>
				<SoundSlider
					color={
						this.pageOn
							? this.props.player.secondaryColors.Vibrant
							: this.props.player.colors.vibrant
					}
					current={this.state.volume}
					toggleSound={this.toggleSound}
					muted={this.state.muted}
					handleVolumeChange={this.handleVolumeChange}
					ChangeVolume={this.ChangeVolume}
					height={this.state.height}
				/>
			</div>
		);
	}
}

export default withRouter(Footer);

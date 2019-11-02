import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import '../../style/Chatroom.scss';

class Chatroom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			message: '',
			messages: this.props.messages || [],
			currentTyper: ''
		};
		this.socket = io(`10.150.40.202:4001/rooms`);
		this.socket.on('connect', function(data) {
			joinRoom();
		});
		this.socket.on('SYNC_PLAYER', data => {
			console.log(data);
			if (this.props.isHost) {
				console.log('Im host!');
				const { socketId } = data;
				sendPlayerState(socketId, this.props.player);
			}
		});
		this.socket.on('RECEIVE_PLAYER_STATE', data => {
			const { player } = data;
			this.props.setPlayer(player);
			this.props.spotifyData.player.playSong(player.currentSong.uri);
		});
		// once the client recieve a message send it to the server
		this.socket.on('RECEIVE_MESSAGE', function(data) {
			addMessage(data);
		});
		// the server will then send the message back and update the state
		const addMessage = data => {
			this.setState({
				messages: [...this.state.messages, data],
				currentTyper: ''
			});
		};
		// when a user sends a message in the chatroom it will display the author and message
		this.sendMessage = ev => {
			ev.preventDefault();
			const message = {
				author: this.props.user.username,
				authorId: this.props.user.id,
				message: this.state.message,
				roomId: this.props.roomId
			};
			this.socket.emit('SEND_MESSAGE', message);
			// fetch('/graphql', {
			//     method: POST
			//     body: JSON.stringify({})
			// })
			this.setState({
				message: '',
				messages: [...this.state.messages, message]
			});
		};

		// whenever someone is typing a messgae, everyone in the chatroom will be able to see it
		this.socket.on('typing', function(data) {
			addFeedback();
		});
		const joinRoom = () => {
			this.socket.emit('JOIN_ROOM', {
				roomId: this.props.roomId
			});
		};
		const addFeedback = data => {
			this.setState({ currentTyper: this.props.username });
		};
		const sendPlayerState = (socketId, player) => {
			this.socket.emit('SEND_PLAYER_STATE', { socketId, player });
		};
	}
	requestPlayerState = socketId => {
		console.log(socketId);
		this.socket.emit('REQUEST_PLAYER_STATE', {
			socketId,
			roomId: this.props.roomId
		});
	};

	scrollToBottom = () => {
		const messagesContainer = ReactDOM.findDOMNode(this.messagesContainer);
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	};
	componentDidMount() {
		this.scrollToBottom();
	}
	componentDidUpdate() {
		this.scrollToBottom();
	}

	render() {
		return (
			<div className='main-chatroom'>
				<div className='chat'>
					<div className='chat-title'>
						<h1>Chat room</h1>
						<h2>Sound Good Music</h2>
						{this.state.currentTyper && (
							<h4>{this.state.currentTyper} is typing...</h4>
						)}
						<figure className='avatar'>
							<img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg' />
						</figure>
					</div>
					<div
						ref={el => {
							this.messagesContainer = el;
						}}
						className='messages'
						style={{ overflowY: 'scroll', scrollbarColor: 'yellow blue' }}>
						{this.state.messages.map((message, i) => {
							return (
								<div class='message new' key={i}>
									<figure class='avatar'>
										<img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg' />
									</figure>
									{message.author}:
									<br />
									{message.message}
								</div>
							);
						})}
					</div>
					<form onSubmit={this.sendMessage}>
						<div className='message-box'>
							<input
								className='message-input'
								type='text'
								placeholder={this.props.username}
								disabled
							/>
							<input
								className='message-input'
								placeholder='Enter a message'
								value={this.state.message}
								onChange={ev => this.setState({ message: ev.target.value })}
							/>

							<button className='message-submit' type='submit'>
								{' '}
								Submit
							</button>
						</div>
					</form>
					<br />
					<button onClick={() => this.requestPlayerState(this.socket.id)}>
						Sync player
					</button>
				</div>
			</div>
		);
	}
}

const mapState = state => {
	return { ...state };
};
const mapDispatch = dispatch => {
	return {
		setPlayer: payload =>
			dispatch({ type: 'PLAYER_SET_STATE_FROM_HOST', payload })
	};
};
export default connect(
	mapState,
	mapDispatch
)(Chatroom);

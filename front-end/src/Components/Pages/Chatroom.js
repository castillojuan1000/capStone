import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import '../../style/Chatroom.scss';

class Chatroom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: this.props.username || '',
			message: '',
			messages: this.props.messages || [],
			currentTyper: ''
		};
		this.socket = io(`/rooms`);
		this.socket.on('connect', function (data) {
			joinRoom();
		});
		// once the client recieve a message send it to the server
		this.socket.on('RECEIVE_MESSAGE', function (data) {
			addMessage(data);
		});
		const joinRoom = () => {
			this.socket.emit('JOIN_ROOM', {
				roomId: this.props.roomId
			});
		};
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
			this.setState({
				message: '',
				messages: [...this.state.messages, message]
			});
		};

		// whenever someone is typing a messgae, everyone in the chatroom will be able to see it
		this.socket.on('typing', function (data) {
			addFeedback();
		});

		const addFeedback = data => {
			this.setState({ currentTyper: this.props.username });
		};
	}

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
							<img
								src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg'
								alt=''
							/>
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
								<div className='message new' key={i}>
									<figure className='avatar'>
										<img
											src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg'
											alt=''
										/>
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
								value={this.props.user.username}
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
				</div>
			</div>
		);
	}
}

const mapState = state => {
	return { ...state };
};
export default connect(
	mapState,
	null
)(Chatroom);

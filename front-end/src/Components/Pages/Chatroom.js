import React, { Component } from 'react';
import io from 'socket.io-client';
import '../../style/Chatroom.scss';

class Chatroom extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			message: '',
			messages: [],
			currentTyper: ''
		};
		this.socket = io('localhost:4000');

		// once the client recieve a message send it to the server
		this.socket.on('RECEIVE_MESSAGE', function(data) {
			addMessage(data);
		});

		// the server will then send the message back and update the state
		const addMessage = data => {
			console.log(data);
			this.setState({ messages: [...this.state.messages, data] });
			console.log(this.state.messages);
		};
		// when a user sends a message in the chatroo it will display the author and message
		this.sendMessage = ev => {
			ev.preventDefault();
			this.socket.emit('SEND_MESSAGE', {
				author: this.state.username,
				message: this.state.message
			});

			this.setState({ message: '' });
		};

		// whenever someone is typing a messgae, everyone in the chatroom will be able to see it
		this.socket.on('typing', function(data) {
			addFeedback(data);
		});

		const addFeedback = data => {
			this.setState({ currentTyper: [...this.state.currentTyper, data] });
		};
	}

	render() {
		return (
			<div className='chat'>
				<div class='chat-title'>
					<h1>Joetta Hall</h1>
					<h2>Sound Good</h2>
					<figure class='avatar'>
						<img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg' />
					</figure>
				</div>
				<div className='messages'>
					{this.state.messages.map(message => {
						return (
							<div class='message new'>
								<figure class='avatar'>
									<img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg' />
								</figure>
								{message.author}:{message.message}
							</div>
						);
					})}
				</div>
				<div className='message-box'>
					<textarea
						className='message-input'
						type='text'
						placeholder='Username'
						value={this.state.username}
						onChange={ev => this.setState({ username: ev.target.value })}
					/>
					<textarea
						className='message-input'
						placeholder='Enter a message'
						value={this.state.message}
						onChange={ev => this.setState({ message: ev.target.value })}
					/>

					<div
						className='message-submit'
						onClick={this.sendMessage}
						type='submit'>
						{' '}
						Submit
					</div>
				</div>
			</div>
		);
	}
}

export default Chatroom;

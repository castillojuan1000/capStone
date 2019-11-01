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
		this.socket = io('localhost:4001');

		// once the client recieve a message send it to the server
		this.socket.on('RECEIVE_MESSAGE', function(data) {
			addMessage(data);
		});
		// the server will then send the message back and update the state
		const addMessage = data => {
			this.setState({ messages: [...this.state.messages, data] });
		};
		// when a user sends a message in the chatroo it will display the author and message
		this.sendMessage = ev => {
			ev.preventDefault();
			this.socket.emit('SEND_MESSAGE', {
				author: this.props.username,
				authorId: this.props.id,
				message: this.state.message
			});
			// fetch('/graphql', {
			//     method: POST
			//     body: JSON.stringify({})
			// })
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
					<div class='chat-title'>
						<h1>Chat room</h1>
						<h2>Sound Good Music</h2>
						<figure class='avatar'>
							<img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg' />
						</figure>
					</div>
					<div
						ref={el => {
							this.messagesContainer = el;
						}}
						className='messages'
						style={{ overflowY: 'scroll', scrollbarColor: 'yellow blue' }}>
						{this.state.messages.map(message => {
							return (
								<div class='message new'>
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
				</div>
			</div>
		);
	}
}

const mapState = state => {
	return { ...state.user };
};
export default connect(
	mapState,
	null
)(Chatroom);

import React, { Component } from 'react'
import io from "socket.io-client"



class Chatroom extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            message: '',
            messages: [],
            currentTyper: ''
        };
        this.socket = io('localhost:4000');

        // once the client recieve a message send it to the server
        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        // the server will then send the message back and update the state 
        const addMessage = data => {
            console.log(data);
            this.setState({ messages: [...this.state.messages, data] });
            console.log(this.state.messages);
        }
        // when a user sends a message in the chatroo it will display the author and message
        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                author: this.state.username,
                message: this.state.message
            })

            this.setState({ message: '' });
        }

        // whenever someone is typing a messgae, everyone in the chatroom will be able to see it 
        this.socket.on('typing', function (data) {
            addFeedback(data)
        })

        const addFeedback = data => {
            this.setState({ currentTyper: [...this.state.currentTyper, data] })
        }
    }

    render() {



        return (

            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">Global Chat</div>
                                <hr />
                                <div className="messages">
                                    {this.state.messages.map(message => {
                                        return (
                                            <div>{message.author}: {message.message}</div>
                                        )
                                    })}
                                </div>

                            </div>
                            <div className="card-footer">
                                <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} className="form-control" />
                                <br />
                                <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                                <br />
                                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}


export default Chatroom
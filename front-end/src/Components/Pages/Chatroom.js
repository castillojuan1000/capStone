import React, { Component } from 'react'
import io from "socket.io-client"
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl'


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
        const useStyles = makeStyles(theme => ({
            root: {
                flexGrow: '1'
            },
            paper: {
                padding: theme.spacing(2),
                textAlign: 'center',
                color: theme.palette.text.secondary,
            },
            submit: {
                margin: theme.spacing(3, 0, 2)
            },
        }));
        const classes = useStyles();
    }




    render() {

        return (

            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>xs=6>
                                <div className="card-title">Global Chat</div>
                            <hr />
                            <div className="messages">
                                {this.state.messages.map(message => {
                                    return (
                                        <div>{message.author}: {message.message}</div>
                                    )
                                })}
                            </div>

                        </Paper>
                        <FormControl>
                            <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} className="form-control" />
                            <br />
                            <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                            <br />
                            <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                        </FormControl>


                    </Grid>
                </Grid>
            </div>

        );
    }
}


export default withRouter(Chatroom)
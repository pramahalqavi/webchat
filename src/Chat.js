import React from "react";
import io from "socket.io-client";

class Chat extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            message: '',
            messages: []
        };

        this.socket = io('localhost:8080');

        this.socket.on('RECEIVE_MESSAGE', function(data){
            addMessage(data);
        });

        const addMessage = data => {
            console.log(data);
            this.setState({messages: [...this.state.messages, data]});
            console.log(this.state.messages);
        };

        this.sendMessage = ev => {
            ev.preventDefault();
            if (this.state.message !== '') {
                this.socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    message: {type: 'text',
                        content: this.state.message}
                })
                this.setState({message: ''});
            }
        }
        this.sendButtonMessage = buttonMessage => {
            this.socket.emit('SEND_MESSAGE', {
                author: this.state.username,
                message: {type: 'text',
                    content: buttonMessage}
            })
        }
    }
    
    render(){
        let textMessages = [];
        let buttonMessages = [];
        return (
            <div className="chat_window">
                <div className="row">
                    <div className="chat_window">
                        <div className="card-body">
                            <div className="top_menu">
                                <div className="title">Chat</div>
                                <hr/>
                            </div>
                            <div className="messages">
                                {this.state.messages.map(message => {
                                    textMessages = [];
                                    buttonMessages = [];
                                    if (message.message.type === 'text') {
                                        if (message.author === 'bot') {
                                            textMessages.push(<div className="leftBubble">{message.message.content}</div>);
                                        } else {
                                            textMessages.push(<div className="rightBubble">{message.message.content}</div>);
                                        }
                                        return (textMessages);
                                    } else if (message.message.type === 'template') {
                                        buttonMessages.push(message.message.items.map(item => {
                                            return (
                                                <div>
                                                    <button onClick={(buttonMessage) => this.sendButtonMessage(item.text)} className="optionButton">{item.text}</button>
                                                    <br/>
                                                    <br/>
                                                </div>
                                            )
                                            }));
                                        return (<div className="leftBubble">{buttonMessages}</div>);
                                    }
                                })}       
                            </div>
                        </div>
                        <div className="bottom_wrapper clearfix">
                        <form className="message_input_wrapper">
                            <input type="text" placeholder="Message" className="message_input" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
                            <button onClick={this.sendMessage} className="send_message">Send</button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
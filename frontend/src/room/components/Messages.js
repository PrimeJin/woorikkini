import React, { Component } from 'react';
import styled from 'styled-components';
import Message from './Message';

const ChatContainer = styled.div``;

class Messages extends Component {
  render() {
    const { messages } = this.props;

    return messages.map((message, index) => (
      <ChatContainer className={`messages__item ${message.chatClass}`} key={index}>
        <Message text={message.text} userName={message.userName} />
      </ChatContainer>
    ));
  }
}

export default Messages;

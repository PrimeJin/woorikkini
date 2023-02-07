import React, { Component } from 'react';
import styled from 'styled-components';

const Username = styled.p`
  color: #42387a;
  font-size: 0.8rem;
  font-weight: 600;
`;

const MessageContainer = styled.div`
  width: 200px;
  height: 50px;

  background: #d6ebfc;
  border-radius: 100px;
`;

const ChatText = styled.p`
  font-size: 1rem;
  font-style: normal;
`;

class Message extends Component {
  render() {
    const { text, userName } = this.props;

    return (
      <MessageContainer>
        <Username>{userName}</Username>
        <ChatText>{text}</ChatText>
      </MessageContainer>
    );
  }
}

export default Message;

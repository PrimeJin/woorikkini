import React, { Component } from 'react';
import styled from 'styled-components';

const Username = styled.div`
  color: #42387a;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 5%;
  padding-left: 10%;
`;

const MessageContainer = styled.div`
  font-family: 'NanumSquareRound';
  text-align: left;
`;

const ChatText = styled.div`
  font-family: 'NanumSquareRound';
  font-size: 1rem;
  width: auto;
  overflow: hidden;
  height: auto;
  margin: 0 20% 10% 2%;
  background: #d6ebfc;
  border-radius: 50px;
  padding-left: 10%;
  min-height: 10px;
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

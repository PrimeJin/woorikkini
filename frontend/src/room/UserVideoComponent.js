import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import styles from './UserVideo.module.css';

export default class UserVideoComponent extends Component {
  constructor(props) {
    super(props);
    this.handleVideoClicked = this.handleVideoClicked.bind(this);
  }

  // 유저의 닉네임 가져오기
  getNicknameTag() {
    // return this.props.userNickname;
  }

  // 비디오 클릭 시 이벤트
  handleVideoClicked(event) {
    if (this.props.mainVideoStream) {
      this.props.mainVideoStream(this.props.streamManager);
    }
  }

  render() {
    return (
      <div style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
        {this.props.streamManager !== undefined ? (
          <OpenViduVideoComponent streamManager={this.props.streamManager} />
        ) : null}
      </div>
    );
  }
}

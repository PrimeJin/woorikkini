import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default class UserVideoComponent extends Component {
  constructor(props) {
    super(props);
    this.handleVideoClicked = this.handleVideoClicked.bind(this);
  }

  // 유저의 닉네임 가져오기
  getNicknameTag() {
    return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
  }

  // 비디오 클릭 시 이벤트
  handleVideoClicked(event) {
    if (this.props.mainVideoStream) {
      this.props.mainVideoStream(this.props.streamManager);
    }
  }

  render() {
    return (
      <div>
        {this.props.streamManager !== undefined ? (
          <div className="streamcomponent">
            <OpenViduVideoComponent streamManager={this.props.streamManager} />
            <div>
              <p>{this.getNicknameTag()}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

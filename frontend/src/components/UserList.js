import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const UserList = (props) => {
  props.users.map((user, index) => {
    return (
      <li>
        <Box>
          <Stack direction="row" spacing={3}>
            <div>{user.userNickname}</div>

            <Button
              name="report"
              value={user.userId}
              variant="contained"
              color="error"
              size="small"
              onClick={this.openModal}
            >
              신고
            </Button>
            <Button
              onClick={() => this.startVote({ userId: user.userId, userNickname: user.userNickname })}
              name="vote"
              value={user.userId}
              variant="contained"
              color="error"
              size="small"
            >
              강퇴
            </Button>
          </Stack>
        </Box>
      </li>
    );
  });
};

export default UserList;

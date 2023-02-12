import React from "react";
import { Link } from "react-router-dom";

function AdminNoticeList(props) {
  const id = props.notice.noticeId;
  const title = props.notice.noticeTitle;
  const time = props.notice.createdTime.substr(0, 10);

  return (
    <tr>
      <td>{id}</td>
      <td>
        <Link
          to={`${props.notice.noticeId}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          {title}
        </Link>
      </td>
      <td>{time}</td>
    </tr>
  );
}

export default AdminNoticeList;

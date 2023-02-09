import React from "react";

function NoticeList(props) {
  const noticeDetail = `notice/${props.notice.noticeId}`;
  const id = props.notice.noticeId;
  const title = props.notice.noticeTitle;
  const time = props.notice.createdTime.substr(0, 10);

  return (
    <tr>
      <td>{id}</td>
      <td>
        <a
          href={noticeDetail}
          style={{ textDecoration: "none", color: "black" }}
        >
          {title}
        </a>
      </td>
      <td>{time}</td>
    </tr>
  );
}

export default NoticeList;

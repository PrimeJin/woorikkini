import React from "react";

function NoticeList(props) {
  const title = props.notice.title;
  const noticeDetail = `notice/${props.notice.id}`;

  return (
    <div>
      <a href={noticeDetail} style={{ textDecoration: "none", color: "black" }}>
        {title}
      </a>
    </div>
  );
}

export default NoticeList;

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const adminList = [
    {
      to: "/admin/notice",
      name: "공지사항",
    },
    {
      to: "/admin/allUsers",
      name: "회원조회",
    },
    {
      to: "/admin/report",
      name: "신고내역",
    },
    {
      to: "/admin/stats",
      name: "회원통계",
    },
  ];

  function goDash() {
    navigate("/admin");
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoDiv}>
        <Link to="/admin">
          <img
            className={styles.logo}
            src={`${process.env.PUBLIC_URL}/logo.png`}
            onClick={goDash}
          />
        </Link>
        <button className={styles.logout}>LOGOUT</button>
      </div>
      {adminList.map((admin, index) =>
        admin.to === location.pathname ? (
          <Link to={admin.to} key={index} className={styles.here}>
            {admin.name}
          </Link>
        ) : (
          <Link to={admin.to} key={index} className={styles.link}>
            {admin.name}
          </Link>
        )
      )}
    </div>
  );
}

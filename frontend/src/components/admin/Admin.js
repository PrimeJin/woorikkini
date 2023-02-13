import React, { useState, useEffect } from "react";
import styles from "./Admin.module.css";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNotice from "./AdminNotice";
import AdminReport from "./AdminReport";
import AdminAllUsers from "./AdminAllUsers";
import AdminStats from "./AdminStats";

function Admin() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.admin}></div>
      <AdminSidebar />
      <div
        style={{
          marginLeft: "10%",
          justifyContent: "center",
          display: "flex",
          flexFlow: "wrap row",
        }}
      >
        <h1>대시보드</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            margin: "2%",
            height: "600px",
            gridGap: "5%",
            marginBottom: "0%",
          }}
        >
          <div
            style={{
              height: "100%",
              overflow: "hidden",
              border: "1px solid black",
              fontSize: "10px",
            }}
          >
            <AdminNotice />
          </div>
          <div
            style={{
              height: "100%",
              overflow: "hidden",
              border: "1px solid black",
              fontSize: "10px",
            }}
          >
            <AdminReport />
          </div>
          <div
            style={{
              height: "100%",
              overflow: "hidden",
              border: "1px solid black",
              fontSize: "10px",
            }}
          >
            <AdminAllUsers />
          </div>
          <div
            style={{
              height: "100%",
              overflow: "hidden",
              border: "1px solid black",
              fontSize: "10px",
            }}
          >
            <AdminStats />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;

import React from "react";
import { Link } from "react-router-dom";

function NavigationBar({ onLogout }) {
  const navBarStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #ccc",
    marginBottom: "20px",
  };


  return (
    <nav style={navBarStyle}>
      <Link
        to="/profile"
       
        title="your profile"
      >
        <span
          style={{
            fontSize: "20px",
            cursor: "pointer",
            textDecoration: "none",
            color: "#333",
          }}
        >
          👤
        </span>
      </Link>
      <button
        onClick={onLogout}
        style={{
          
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
       logout
      </button>
    </nav>
  );
}

export default NavigationBar;

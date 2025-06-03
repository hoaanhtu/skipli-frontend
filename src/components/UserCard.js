import React from "react";

function UserCard({ user, isLiked, onLikeToggle }) {
  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    margin: "10px",
    width: "calc(33.333% - 20px)",
    minWidth: "280px",
    boxSizing: "border-box",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  };
  const avatarStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    marginRight: "15px",
    border: "1px solid #eee",
  };

  const statsStyle = {
    fontSize: "0.9em",
    color: "#555",
    marginBottom: "5px",
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <img
          src={user.avatar_url}
          alt={`${user.login} avatar`}
          style={avatarStyle}
        />
        <div>
          <h3>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "#333",
              }}
            >
              {user.login}
            </a>
          </h3>
          <div style={{ fontSize: "0.8em", color: "#777" }}>ID: {user.id}</div>
        </div>
      </div>
      <p style={statsStyle}>
        html_url: {user.html_url !== undefined ? user.html_url : "N/A"}
      </p>

      <p style={statsStyle}>
        Public Repos:{" "}
        {user.public_repos !== undefined ? user.public_repos : "N/A"}
      </p>
      <p style={statsStyle}>
        Followers: {user.followers !== undefined ? user.followers : "N/A"}
      </p>
      <button
        onClick={onLikeToggle}
        style={{
          cursor: "pointer",
          color: isLiked ? "red" : "#aaa",
          fontSize: "24px",
          background: "none",
          border: "none",
          alignSelf: "flex-end",
          marginTop: "auto",
        }}
        title={isLiked ? "unLike" : "Like"}
      >
        {isLiked ? "❤️" : "🤍"}
      </button>
    </div>
  );
}

export default UserCard;

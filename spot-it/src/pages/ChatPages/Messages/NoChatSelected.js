import React from "react";

export const NoChatSelected = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  };

  const headingStyle = {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "20px",
  };

  const imageStyle = {
    height: "400px",
    width: "350px",
    borderRadius: "10px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Please Select a Chat</h1>
      {/* <img
        src="/assets/no_chat.jpg"
        alt="No chat selected"
        style={imageStyle}
      /> */}
    </div>
  );
};

import React from "react";
import "./Profile.css";

const Profile = (props) => {
  return (
    <div className="container">
      <h2>Hi, {props.currAccount}</h2>
    </div>
  );
};

export default Profile;

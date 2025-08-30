import React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const { user } = useSelector((state) => state.userInfo);
  const { name } = user;
  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome back, {name}</p>
    </div>
  );
}

export default Profile;

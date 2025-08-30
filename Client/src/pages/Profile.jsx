import React from "react";
import { useSelector } from "react-redux";
import Card from "../components/UI/Card";

function Profile() {
  const { user } = useSelector((state) => state.userInfo);
  const { name, email, role } = user;
  console.log(user);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="text-center text-slate-70 justify-center items-center m-10">
      <h1 className="mb-2">Profile</h1>

      <p>Welcome back, {name}</p>
      <p>Email: {email}</p>
      <p>Role: {role}</p>
    </Card>
  );
}

export default Profile;

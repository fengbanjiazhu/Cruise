import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { fetchPost, optionMaker } from "../utils/api";
import { fetchUserInfoUntilSuccess } from "../store/slices/userInfoSlice";

const th_style = {
  padding: "0.85rem",
  fontWeight: 600,
  textAlign: "left",
  letterSpacing: "0.01em",
};

const td_style = { padding: "0.85rem", color: "#555" };

function ProfilePage() {
  const { user, token } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editingEmail, setEditingEmail] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-[#555] mb-4">User not logged in.</p>
        <Button onClick={() => window.location.href = "/login"}>
          Go to Login
        </Button>
      </div>
    );
  }

  const handleSave = async (field) => {
  try {
    setLoading(true);
    const data = field === "name" ? { name } : { email };
    await fetchPost("user/update", optionMaker(data, "PATCH", token));
    toast.success(`${field === "name" ? "Name" : "Email"} updated successfully!`);
    if (field === "name") setEditing(false);
    else setEditingEmail(false);
    dispatch(fetchUserInfoUntilSuccess()); // refresh user info
  } catch (err) {
    console.error(err);
    toast.error(`Failed to update ${field}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#f7f7fa] px-4 pt-16">
      <h1 className="text-[2rem] font-bold tracking-[-0.01em] text-[#222] mb-6 text-center">
        My Profile
      </h1>

      <table className="w-full max-w-[500px] border-separate border-spacing-0 rounded-xl overflow-hidden shadow-[0_2px_12px_0_rgba(0,0,0,0.06)] bg-white border border-[#ececf0]">
        <thead className="bg-[#f7f7fa] text-[#555] border-b border-[#ececf0]">
          <tr>
            <th style={th_style}>Field</th>
            <th style={th_style}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr
            style={{ background: "#fff" }}
            className="hover:bg-[#ececf0] transition-colors"
          >
            <td style={td_style}>Name</td>
            <td style={td_style}>
              {editing ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded p-1 text-[#222]"
                  />
                  <Button onClick={handleSave} disabled={loading}>
                    Save
                  </Button>
                  <Button onClick={() => { setEditing(false); setName(user.name); }}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  {name}
                  <Button onClick={() => setEditing(true)}>Edit</Button>
                </div>
              )}
            </td>
          </tr>

                    <tr
            style={{ background: "#f7f7fa" }}
            className="hover:bg-[#ececf0] transition-colors"
            >
            <td style={td_style}>Email</td>
            <td style={td_style}>
                {editingEmail ? (
                <div className="flex gap-2 items-center">
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded p-1 text-[#222]"
                    />
                    <Button onClick={() => handleSave("email")} disabled={loading}>
                    Save
                    </Button>
                    <Button
                    onClick={() => {
                        setEditingEmail(false);
                        setEmail(user.email);
                    }}
                    >
                    Cancel
                    </Button>
                </div>
                ) : (
                <div className="flex gap-2 items-center">
                    {email}
                    <Button onClick={() => setEditingEmail(true)}>Edit</Button>
                </div>
                )}
            </td>
            </tr>
          <tr
            style={{ background: "#fff" }}
            className="hover:bg-[#ececf0] transition-colors"
          >
            <td style={td_style}>Password</td>
            <td style={td_style}>{"•".repeat(8)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProfilePage;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { fetchPost, optionMaker,checkEmail } from "../utils/api";
import { fetchUserInfoUntilSuccess, updateUser } from "../store/slices/userInfoSlice";


const th_style = {
  padding: "0.85rem",
  fontWeight: 600,
  textAlign: "left",
  letterSpacing: "0.01em",
};

const td_style = { padding: "0.85rem", color: "#555" };
const backendURL = "http://localhost:8000/uploads/";

function ProfilePage() {
  
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.userInfo);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.photo ? `${backendURL}${user.photo}` : "default.jpg");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfilePic(user.photo ? `${backendURL}${user.photo}` : "default.jpg");
    }
  }, [user]);
  

 const handleSave = async (field) => {
    if (!token) {
      toast.error("Token missing, please login again");
      return;
    }
    try {
      setLoading(true);
      if (field === "email" && email === user.email) {
      toast.error("Email unchanged");
      return;
    }

    // Frontend check for email duplication
    if (field === "email") {
      const result = await checkEmail(email);
      if (result?.exist) {
        toast.error("This email is already taken");
        return; // Stop before sending request
      }
    }
      const data = field === "name" ? { name } : { email };
      await fetchPost("user/update", optionMaker(data, "PATCH", token));
      toast.success(`${field === "name" ? "Name" : "Email"} updated successfully!`);
      if (field === "name") setEditingName(false);
      else setEditingEmail(false);

      
      dispatch(updateUser({ ...user, ...data }));
      dispatch(fetchUserInfoUntilSuccess());

    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${field}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!token) {
      toast.error("Token missing, please login again");
      return;
    }
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both current and new password");
      return;
    }
    try {
      setLoading(true);
      await fetchPost(
        "user/update-password",
        optionMaker({ oldPassword: currentPassword, newPassword, newPasswordConfirm: newPassword }, "PATCH", token)
      );
      toast.success("Password updated successfully!");
      setEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error("wrong password ");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePic(URL.createObjectURL(file)); 
    }
  };

  const handleSaveProfilePic = async () => {
    if (!token || !selectedFile) return toast.error("No file selected");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const res = await fetchPost("user/update-photo", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const newPhotoURL = `${backendURL}${res.data.data.photo}`;
      console.log("Backend response:", res);
      setProfilePic(newPhotoURL);
      console.log("Backend response:", res);

      
      
      setSelectedFile(null);
      dispatch(updateUser({ ...user, photo: res.data.data.photo }));
      toast.success("Profile picture updated!");
      console.log("Backend response:", res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile picture");
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
            <th style={th_style}>Data</th>
            
          </tr>
        </thead>
        <tbody>

          <tr className="hover:bg-[#ececf0] transition-colors" style={{ background: "#fff" }}>
            <td style={td_style}>Profile Picture</td>
            <td style={td_style}>
              <div className="flex flex-col gap-2">
                { (selectedFile || profilePic) && (
                <img
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile) 
                      : profilePic 
                  }
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <Button onClick={handleSaveProfilePic} disabled={loading || !selectedFile}>
                  Save
                </Button>
              </div>
            </td>
          </tr>
          <tr
            style={{ background: "#fff" }}
            className="hover:bg-[#ececf0] transition-colors"
          >
            <td style={td_style}>Name</td>
            <td style={td_style}>
              {editingName ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded p-1 text-[#222]"
                  />
                  <Button onClick={() => handleSave("name")} disabled={loading}>
                    Save
                  </Button>
                  <Button onClick={() => { setEditingName(false); setName(user.name); }}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  {name}
                  <Button onClick={() => setEditingName(true)}>Edit</Button>
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
                <div className="flex justify-between items-center">
                    {email}
                    <Button onClick={() => setEditingEmail(true)}>Edit</Button>
                </div>
                )}
            </td>
            </tr>
          <tr className="hover:bg-[#ececf0] transition-colors" style={{ background: "#fff" }}>
            <td style={td_style}>Password</td>
            <td style={td_style}>
              {editingPassword ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border rounded p-1 text-[#222]"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border rounded p-1 text-[#222]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSavePassword} disabled={loading}>
                      Save
                    </Button>
                    <Button onClick={() => { setEditingPassword(false); setCurrentPassword(""); setNewPassword(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  {"•".repeat(8)}
                  <Button onClick={() => setEditingPassword(true)}>Edit</Button>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProfilePage;

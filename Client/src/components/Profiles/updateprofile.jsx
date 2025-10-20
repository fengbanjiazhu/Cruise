import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { fetchPost, optionMaker, checkEmail } from "../../utils/api";
import { fetchUserInfoUntilSuccess, updateUser } from "../../store/slices/userInfoSlice";

import { DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const td_style = { padding: "0.85rem", color: "#555" };

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async (field) => {
    if (!token) {
      toast.error("Token missing, please login again");
      return;
    }

    if (field === "name" && !name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    if (field === "email" && !email.trim()) {
      toast.error("Please enter an email");
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
        if (result?.exists) {
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
      const backendMsg = err?.response?.data?.message || `Failed to update ${field}`;
      toast.error(backendMsg);
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
        optionMaker(
          { oldPassword: currentPassword, newPassword, newPasswordConfirm: newPassword },
          "PATCH",
          token
        )
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

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Update Profile Details</DialogTitle>
        <div className="p-2">
          <table className="w-full border-separate border-spacing-0 rounded-xl overflow-hidden shadow-[0_2px_12px_0_rgba(0,0,0,0.06)] bg-white border border-[#ececf0]">
            <tbody>
              <tr
                className="hover:bg-[#ececf0] transition-colors"
                style={{ background: "#fff" }}
              ></tr>
              <tr style={{ background: "#fff" }} className="hover:bg-[#ececf0] transition-colors">
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
                      <Button
                        onClick={() => {
                          setEditingName(false);
                          setName(user.name);
                        }}
                      >
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
                        <Button
                          onClick={() => {
                            setEditingPassword(false);
                            setCurrentPassword("");
                            setNewPassword("");
                          }}
                        >
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
      </DialogHeader>
      {/* <DialogFooter> */}
      <DialogClose asChild>
        <Button className="mt-4">Close</Button>
      </DialogClose>
      {/* </DialogFooter> */}
    </div>
  );
}

export default ProfilePage;

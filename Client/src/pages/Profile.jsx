import { useSelector } from "react-redux";
import Card from "../components/ui/OldCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import FavList from "../components/Profiles/FavList";

function Profile() {
  const { user } = useSelector((state) => state.userInfo);
  
  if (!user) {
    return <p>Loading...</p>;
  }
  const { name, email, role, savedList } = user;


  return (
    <div className="flex flex-col md:flex-row md:space-x-10 space-y-10 md:space-y-0">
      <Card className="text-center text-slate-70 justify-center items-center mt-10 mx-auto md:mx-6 md:my-6">
        <h1 className="mb-6 ">Profile</h1>

        <Avatar className="mb-10">
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>

        <p>Welcome back, {name}</p>
        <p>Email: {email}</p>
        <p>Role: {role}</p>
      </Card>

      <FavList savedList={savedList} />
    </div>
  );
}

export default Profile;

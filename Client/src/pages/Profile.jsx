import { useSelector } from "react-redux";
import Card from "../components/UI/OldCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FavList from "../components/Profiles/FavList";

function Profile() {
  const { user } = useSelector((state) => state.userInfo);
  const { name, email, role, savedList } = user;

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Card className="text-center text-slate-70 justify-center items-center m-10">
        <h1 className="mb-10">Profile</h1>

        <Avatar className="mb-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <p>Welcome back, {name}</p>
        <p>Email: {email}</p>
        <p>Role: {role}</p>
      </Card>

      <FavList savedList={savedList} />
    </>
  );
}

export default Profile;

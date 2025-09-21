import { useSelector } from "react-redux";
import Card from "../components/UI/OldCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import PathBriefTab from "../components/Paths/PathBriefTab";

function Profile() {
  const { user } = useSelector((state) => state.userInfo);
  const { name, email, role, savedList } = user;
  console.log(user);

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

      <ScrollArea className="h-90 w-[550px] m-10 rounded-md border p-4">
        {savedList.length === 0 && <p>No saved paths</p>}
        {savedList.length > 0 && <PathBriefTab path={savedList[0]} />}
      </ScrollArea>
    </>
  );
}

export default Profile;

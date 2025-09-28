import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/slices/userInfoSlice";
import { useNavigate } from "react-router-dom";

import { fetchPost, optionMaker } from "../../utils/api";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

import { IoHeartDislike } from "react-icons/io5";
import { FaMapMarkedAlt } from "react-icons/fa";

function PathBriefTab({ path }) {
  const { name, profile, distance, duration, _id } = path;
  const { token } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onRemove = async function () {
    try {
      const res = await fetchPost("user/list", optionMaker({ pathid: _id }, "DELETE", token));
      const { data } = res;
      dispatch(updateUser(data));
    } catch (error) {
      console.log(error);
    }
  };

  const onCheckDetail = function () {
    navigate(`/path/${_id}`);
  };

  return (
    <Card className="text-slate-70 text-left justify-center items-center mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
      <CardHeader>
        <CardTitle>{name.toUpperCase()}</CardTitle>
        <CardDescription className="flex gap-2">
          <span className="w-20">Type:</span>
          <span>{profile[0].toUpperCase() + profile.slice(1)}</span>
        </CardDescription>

        <CardDescription className="flex gap-2">
          <span className="w-20">Distance:</span>
          <span>{distance} meters</span>
        </CardDescription>

        <CardDescription className="flex gap-2">
          <span className="w-20">Duration:</span>
          <span>{duration} mins</span>
        </CardDescription>

        <div className="flex gap-6">
          <Button onClick={onRemove} variant="secondary" size="icon" className="size-8">
            <IoHeartDislike />
          </Button>

          <Button onClick={onCheckDetail} variant="secondary" size="icon" className="size-8">
            <FaMapMarkedAlt />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 hidden md:block">
        <AspectRatio ratio={16 / 10} className="bg-muted rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1478059299873-f047d8c5fe1a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </AspectRatio>
      </CardContent>
    </Card>
  );
}

export default PathBriefTab;

// Jeffrey
import { fetchPost, optionMaker } from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/slices/userInfoSlice";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { Button } from "../ui/button";

function SavePathButton({ isSaved, pathId }) {
  const { token } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  const handleAddToList = async (pathId) => {
    if (isSaved) return;
    try {
      const res = await fetchPost("user/list", optionMaker({ pathid: pathId }, "PATCH", token));
      const { data } = res;
      dispatch(updateUser(data));
    } catch (error) {
      console.log(error);
    }
    console.log(pathId);
  };

  return (
    <Button
      className="bg-gray-100 text-black hover:bg-gray-200"
      onClick={() => handleAddToList(pathId)}
    >
      {isSaved ? <IoHeartSharp /> : <IoHeartOutline />}
    </Button>
  );
}

export default SavePathButton;

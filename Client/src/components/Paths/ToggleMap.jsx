import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { toggleMap } from "../../store/slices/mapSlice";
import { Map } from "lucide-react";

function ToggleMap() {
  const dispatch = useDispatch();

  const handleToggleMap = () => {
    dispatch(toggleMap());
  };

  return (
    <Button
      className="bg-transparent py-2 px-4 my-auto"
      variant="ghost"
      size="icon"
      onClick={handleToggleMap}
    >
      <Map />
    </Button>
  );
}

export default ToggleMap;

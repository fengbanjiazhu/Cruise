import { ScrollArea } from "@/components/ui/scroll-area";
import PathBriefTab from "@/components/Paths/PathBriefTab";
import { Link } from "react-router-dom";

function FavList({ savedList }) {
  return (
    <ScrollArea className="h-90 w-[550px] m-10 rounded-md border p-4">
      {savedList.length === 0 && (
        <>
          <p>No saved paths, explore now</p>
          <button>
            <Link to="/path">Explore</Link>
          </button>
        </>
      )}
      {savedList.length > 0 && savedList.map((path) => <PathBriefTab path={path} />)}
    </ScrollArea>
  );
}

export default FavList;

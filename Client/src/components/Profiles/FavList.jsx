import { ScrollArea } from "@/components/ui/scroll-area";
import PathBriefTab from "@/components/Paths/PathBriefTab";
import { Link } from "react-router-dom";

function FavList({ savedList }) {
  return (
    <div className="flex flex-col">
      <h3 className="m-4 md:m-8 text-center">Favorite Paths</h3>
      <ScrollArea className="h-[600px] md:w-[550px] mx-8 rounded-md border p-4">
        {savedList.length === 0 && (
          <>
            <p>No saved paths, explore now</p>
            <button>
              <Link to="/path">Explore</Link>
            </button>
          </>
        )}
        {savedList.length > 0 &&
          savedList.map((path) => <PathBriefTab key={path._id} path={path} />)}
      </ScrollArea>
    </div>
  );
}

export default FavList;

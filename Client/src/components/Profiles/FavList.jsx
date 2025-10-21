// Jeffrey
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import PathBriefTab from "@/components/Paths/PathBriefTab";
import NoResult from "../Paths/NoResult";

function FavList({ savedList }) {
  return (
    <div className="flex flex-col">
      <h3 className="m-4 md:m-8 text-center">Favorite Paths</h3>
      <ScrollArea className="h-[600px] md:w-[550px] mx-8 rounded-md border p-4">
        {savedList.length === 0 && (
          <NoResult title="Empty" message="Looks like you don't have any favorite paths">
            <Button variant="outline">
              <Link to="/allpaths">Explore Now</Link>
            </Button>
          </NoResult>
        )}
        {savedList.length > 0 &&
          savedList.map((path) => <PathBriefTab key={path._id} path={path} />)}
      </ScrollArea>
    </div>
  );
}

export default FavList;

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { CiCircleQuestion } from "react-icons/ci";

function LocationTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <CiCircleQuestion size={16} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Search for paths that start near your chosen location within the radius.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LocationTooltip;

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { CiCircleQuestion } from "react-icons/ci";

function LocationTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CiCircleQuestion size={16} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Select a starting point and define a radius to search within this distance.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LocationTooltip;

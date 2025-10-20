import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Review from "../../pages/Review";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

function ReviewDrawer({ pathID }) {
  return (
    <div className="mt-10">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Browse Reviews</Button>
        </DrawerTrigger>
        <DrawerContent className="z-[1003]">
          <div className="mx-1 w-full">
            <DrawerHeader>
              <DrawerTitle className="text-center">Reviews</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0 w-full">
              <Review pathId={pathID} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default ReviewDrawer;

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import LocationGetter from "../Search/LocationGetter";

import ProfileSelector from "../Search/ProfileSelector";

import { useState } from "react";

function SearchBar() {
  //   const [open, setOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger>Search</SheetTrigger>
      <SheetContent className="w-[200px] sm:w-[300px] mt-14 rounded-lg pt-20">
        <SheetHeader>
          <SheetTitle>Choose your action</SheetTitle>
          <SheetDescription>
            <SaerchForm />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default SearchBar;

function SaerchForm({ className }) {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [radius, setRadius] = useState(10);
  const [profile, setProfile] = useState(null);

  return (
    <div className={`grid items-start gap-6 ${className}`}>
      <div className="grid gap-3">
        <Label htmlFor="name">Path Name</Label>
        <Input id="name" placeholder="Enter path name" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="duration">Duration (min)</Label>
        <Input id="duration" />
      </div>

      <LocationGetter
        location={location}
        setLocation={setLocation}
        radius={radius}
        setRadius={setRadius}
      />

      <ProfileSelector profile={profile} setProfile={setProfile} />

      <Button>Apply Condition</Button>
    </div>
  );
}

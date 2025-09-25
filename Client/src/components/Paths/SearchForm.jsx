import DurationSetter from "../Search/DurationSetter";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import LocationGetter from "../Search/LocationGetter";

import ProfileSelector from "../Search/ProfileSelector";

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function SearchForm({ className }) {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [radius, setRadius] = useState(10);
  const [profile, setProfile] = useState(null);
  const [durationOp, setDurationOp] = useState("gte");
  const [durationVal, setDurationVal] = useState(0);
  const [searchName, setSearchName] = useState("");

  const [, setSearchParams] = useSearchParams();

  const onApply = function () {
    const params = {};

    if (durationVal) {
      params[`duration[${durationOp}]`] = durationVal;
    }

    if (profile && profile !== "null") {
      params.profile = profile;
    }

    if (radius && location?.lat && location?.lng) {
      params.radius = radius;
      params.lat = location.lat;
      params.lng = location.lng;
    }

    if (searchName) {
      params.name = searchName;
    }

    if (Object.keys(params).length === 0) {
      return toast.error("Please select at least one filter");
    }

    setSearchParams(params);
  };

  return (
    <div className={`grid items-start gap-6 ${className}`}>
      <div className="grid gap-3">
        <Label htmlFor="name">Path Name</Label>
        <Input
          id="name"
          placeholder="Enter path name"
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      <DurationSetter compare={durationOp} setCompare={setDurationOp} setValue={setDurationVal} />

      <LocationGetter
        location={location}
        setLocation={setLocation}
        radius={radius}
        setRadius={setRadius}
      />

      <ProfileSelector profile={profile} setProfile={setProfile} />
      <Button onClick={onApply}>Apply Condition</Button>
      <Button className="bg-red-500 text-white rounded" onClick={() => setSearchParams({})}>
        Clear Condition
      </Button>
    </div>
  );
}

export default SearchForm;

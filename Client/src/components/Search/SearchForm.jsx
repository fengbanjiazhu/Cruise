import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isValidLocation } from "../../utils/helper";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import DurationSetter from "./DurationSetter";
import LocationGetter from "./LocationGetter";
import ProfileSelector from "./ProfileSelector";
import ClearSearchBtn from "./ClearSearchBtn";

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

    if (searchName) params.name = searchName;
    if (durationVal) params[`duration[${durationOp}]`] = durationVal;
    if (profile && profile !== "null") params.profile = profile;

    if (radius && location?.lat && location?.lng) {
      params.radius = radius;
      const valid = isValidLocation(location);
      if (!valid) return toast.error("Invalid location format");
      params.lat = location.lat;
      params.lng = location.lng;
    }

    if (Object.keys(params).length === 0) {
      return toast.error("Please select at least one condition");
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
      <ClearSearchBtn />
    </div>
  );
}

export default SearchForm;

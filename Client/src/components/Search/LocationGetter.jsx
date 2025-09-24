import RadiusSlider from "./RadiusSlider";
import LocationTooltip from "./LocationTooltip";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { getLocation } from "../../utils/helper";
import { toast } from "react-hot-toast";

function LocationGetter({ location, setLocation, radius, setRadius }) {
  const handleLocation = async () => {
    try {
      const loc = await getLocation();
      setLocation(loc);
    } catch (err) {
      toast.error("Failed to get location:", err.message);
    }
  };

  return (
    <Card className="grid gap-4 p-4">
      <div className="flex items-center gap-2">
        Find By Location
        <LocationTooltip />
      </div>

      <RadiusSlider radius={radius} setRadius={setRadius} />

      <div className="grid gap-4">
        <Button onClick={handleLocation} className="px-4 py-2 bg-blue-500 text-white rounded">
          Get Location
        </Button>

        <div className="grid gap-3">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            value={location.lat}
            onChange={(e) => setLocation({ ...location, lat: e.target.value })}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            value={location.lng}
            onChange={(e) => setLocation({ ...location, lat: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}

export default LocationGetter;

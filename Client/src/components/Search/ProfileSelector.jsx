// Jeffrey
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function ProfileSelector({ profile, setProfile }) {
  return (
    <div className="grid gap-3">
      <Label>Profile</Label>
      <Select value={profile} onValueChange={setProfile}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Profile" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null">Null</SelectItem>
          <SelectItem value="car">Car</SelectItem>
          <SelectItem value="foot">Foot</SelectItem>
          <SelectItem value="bike">Bike</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default ProfileSelector;

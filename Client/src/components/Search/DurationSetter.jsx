// Jeffrey
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DurationSetter({ compare, setCompare, setValue }) {
  return (
    <div className="grid gap-3">
      <Label htmlFor="duration">Duration (min)</Label>

      <div className="flex items-center gap-2">
        <Select value={compare} onValueChange={setCompare}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gte">{">="}</SelectItem>
            <SelectItem value="lte">{"<="}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          id="duration"
          type="number"
          placeholder="0"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}

export default DurationSetter;

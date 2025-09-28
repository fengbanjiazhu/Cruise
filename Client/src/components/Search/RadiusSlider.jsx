import { Slider } from "@/components/ui/slider";

function RadiusSlider({ radius, setRadius }) {
  const handleChange = (value) => {
    setRadius(value[0]);
  };

  return (
    <div className="grid gap-4">
      <label className="font-medium">Radius: {radius} km</label>
      <Slider defaultValue={[10]} max={100} min={1} step={1} onValueChange={handleChange} />
    </div>
  );
}

export default RadiusSlider;

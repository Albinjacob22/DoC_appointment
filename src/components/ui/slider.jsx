import { Slider } from "@/components/ui/slider"

export default function VolumeControl() {
  return (
    <div className="w-64 p-4">
      <label className="mb-2 block text-sm font-medium">Volume</label>
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  )
}

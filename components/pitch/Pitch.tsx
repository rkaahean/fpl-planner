import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Player from "./Player";

export default function PlayerPitch() {
  return (
    <div className="w-full min-h-full flex flex-col justify-around gap-5">
      <div className="flex flex-row gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">Draft Options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Save draft</DropdownMenuItem>
            <DropdownMenuItem>View timeline</DropdownMenuItem>
            <DropdownMenuItem>View changes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-row justify-between">
        <div>
          <ArrowLeft className="w-5 h-5" />
        </div>
        <div className="text-lg font-bold">Gameweek 26</div>
        <div>
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
      <div>
        <PitchRow num={1} />
        <PitchRow num={3} />
        <PitchRow num={5} />
        <PitchRow num={2} />
        <PitchRow num={4} position="subs" />
      </div>
    </div>
  );
}

function PitchRow(props: { num: number; position?: "subs" | "starters" }) {
  // create an array of 5 elements
  const arr = Array.from({ length: props.num }, (_, i) => i);
  return props.position === "subs" ? (
    <div className="flex flex-row w-full h-1/5 items-center justify-around mt-5 bg-green-50 py-2">
      {arr.map((i) => (
        <Player key={i} />
      ))}
    </div>
  ) : (
    <div className="flex flex-row w-full h-1/5 items-center justify-evenly py-2">
      {arr.map((i) => (
        <Player key={i} />
      ))}
    </div>
  );
}

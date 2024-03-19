"use client";

import ReactQueryProvider from "@/app/provider/ReactQuery";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import PitchRow, { filterData } from "./PitchRow";

export default function Gameweek() {
  const [gameweek, setGameweek] = useState(28);

  const { data, isLoading: isLoadingGameweek } = useQuery({
    queryKey: [gameweek],
    queryFn: async () => {
      return fetch("/gameweek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameweek }),
      }).then((res) => res.json());
    },
  });

  if (isLoadingGameweek) {
    return <div>Loading Players...</div>;
  }

  return (
    <ReactQueryProvider>
      <div>
        <div className="flex flex-row justify-between">
          <button onClick={() => setGameweek(gameweek - 1)}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-lg font-bold">{`Gameweek ${gameweek}`}</div>
          <button onClick={() => setGameweek(gameweek + 1)}>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="h-full">
          <PitchRow
            position="GK"
            data={filterData(data.data, "GK")}
            gameweek={gameweek}
          />
          <PitchRow
            position="DEF"
            data={filterData(data.data, "DEF")}
            gameweek={gameweek}
          />
          <PitchRow
            position="MID"
            data={filterData(data.data, "MID")}
            gameweek={gameweek}
          />
          <PitchRow
            position="FWD"
            data={filterData(data.data, "FWD")}
            gameweek={gameweek}
          />
          <PitchRow
            position="subs"
            data={filterData(data.data, "subs")}
            gameweek={gameweek}
          />
        </div>
      </div>
    </ReactQueryProvider>
  );
}

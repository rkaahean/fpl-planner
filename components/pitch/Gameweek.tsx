"use client";

import ReactQueryProvider from "@/app/provider/ReactQuery";
import { picksStore } from "@/app/store/picks";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PitchRow, { filterData } from "./PitchRow";

export default function Gameweek() {
  const [gameweek, setGameweek] = useState(28);
  const updatePicks = picksStore((state) => state.setPicks);
  let picksData = picksStore((state) => state.data!);

  const { data, isFetching } = useQuery({
    queryKey: ["hello", gameweek],
    queryFn: async () => {
      const response = await fetch("/gameweek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameweek }),
      });
      const data = await response.json();
      updatePicks(data.data);
      return data;
    },
    enabled: gameweek < 29,
  });

  if (isFetching) {
    return <div>Loading Players...</div>;
  }

  if (picksData) {
    return (
      <ReactQueryProvider>
        <div>
          <div className="flex flex-row justify-between">
            <button onClick={() => setGameweek(gameweek - 1)}>
              <ArrowLeftIcon />
            </button>
            <div className="text-lg font-bold">{`Gameweek ${gameweek}`}</div>
            <button onClick={() => setGameweek(gameweek + 1)}>
              <ArrowRightIcon />
            </button>
          </div>
          <div className="h-full">
            <PitchRow
              position="GK"
              data={filterData(picksData, "GK")}
              gameweek={gameweek}
            />
            <PitchRow
              position="DEF"
              data={filterData(picksData, "DEF")}
              gameweek={gameweek}
            />
            <PitchRow
              position="MID"
              data={filterData(picksData, "MID")}
              gameweek={gameweek}
            />
            <PitchRow
              position="FWD"
              data={filterData(picksData, "FWD")}
              gameweek={gameweek}
            />
            <PitchRow
              position="subs"
              data={filterData(picksData, "subs")}
              gameweek={gameweek}
            />
          </div>
        </div>
      </ReactQueryProvider>
    );
  }
}

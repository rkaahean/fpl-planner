import { create } from "zustand";
import { FPLGameweekPicksData } from "../api";

interface DraftState {
  id?: string;
  name?: string;
  description?: string;
  changes: {
    in: number;
    out: number;
    gameweek: number;
  }[];
}
interface State {
  currentGameweek: number;
  data?: FPLGameweekPicksData;
  base?: FPLGameweekPicksData;
  substitutedIn?: number;
  substitutedOut?: number;
  drafts: DraftState;
  incrementPop: () => void;
  setPicks: (picks: FPLGameweekPicksData) => void;
  setBase: (picks: FPLGameweekPicksData) => void;
  setSubstituteIn: (id: number) => void;
  setSubstituteOut: (id: number) => void;
  setCurrentGameweek: (gameweek: number) => void;
  makeSubs: () => void;
  setDrafts: (drafts: DraftState) => void;
}

export const picksStore = create<State>()((set, get) => ({
  drafts: {
    base: [],
    changes: [],
  },
  currentGameweek: 28,
  incrementPop: () => console.log,
  setPicks: (picks: FPLGameweekPicksData) => {
    set({ data: picks });
  },
  setBase: (picks: FPLGameweekPicksData) => {
    set({ base: picks });
  },
  setSubstituteIn: (player_id: number) => {
    /**
     * selects player to be substituted IN, from subs
     */
    set({ substitutedIn: player_id });
  },
  setSubstituteOut: (player_id: number) => {
    /**
     * selects player to be substituted OUT, from starting 11
     */
    set({ substitutedOut: player_id });
  },
  setDrafts: (drafts) => set({ drafts }),
  setCurrentGameweek: (gameweek: number) => {
    if (gameweek <= 38) {
      set({ currentGameweek: gameweek });
    }
  },
  makeSubs: async () => {
    const {
      data,
      drafts,
      substitutedIn,
      substitutedOut,
      currentGameweek: gameweek,
    } = get();
    // if both subs are set
    if (!!substitutedIn && !!substitutedOut) {
      const newData = await swapPlayers(data!, substitutedIn, substitutedOut);
      if (drafts && drafts.changes) {
        drafts.changes.push({
          in: substitutedIn,
          out: substitutedOut,
          gameweek,
        });
      } else {
        drafts.changes = [
          {
            in: substitutedIn,
            out: substitutedOut,
            gameweek,
          },
        ];
      }
      // Update the state with the modified data array
      set({
        data: newData,
        substitutedIn: undefined,
        substitutedOut: undefined,
        drafts,
      });
    }
  },
}));

export async function swapPlayers(
  data: FPLGameweekPicksData,
  substitutedIn: number,
  substitutedOut: number
): Promise<FPLGameweekPicksData> {
  const inPlayerIndex = data.findIndex(
    (player) => player.fpl_player.player_id === substitutedIn
  );
  const outPlayerIndex = data.findIndex(
    (player) => player.fpl_player.player_id === substitutedOut
  );

  let inPlayer;
  if (outPlayerIndex === -1) {
    // if index of player substituted out not found, return
    return data;
  } else if (inPlayerIndex == -1) {
    // this means that the player being bought in is not in the team
    const response = await fetch("/api/player", {
      method: "POST",
      body: JSON.stringify({
        id: substitutedIn,
      }),
    }).then((res) => res.json());
    inPlayer = { fpl_player: response.data };
  } else {
    // hapens when players being switched up within the team
    inPlayer = { ...data[inPlayerIndex] }; // Create a new object
  }

  const outPlayer = { ...data[outPlayerIndex] }; // Create a new object
  // console.log("In", inPlayer, "out", outPlayer);

  if (inPlayer?.position) {
    // Swap the position attribute
    const tempPosition = inPlayer!.position;
    inPlayer!.position = outPlayer.position;
    outPlayer.position = tempPosition;

    const newData = [...data]; // Create a new array with the same elements as data

    // Replace the modified elements in the new array
    newData[inPlayerIndex] = inPlayer!;
    newData[outPlayerIndex] = outPlayer;

    return newData;
  } else {
    const newData = [...data]; // Create a new array with the same elements as data

    inPlayer!.position = outPlayer.position;
    newData[outPlayerIndex] = inPlayer!;

    return newData;
  }
}

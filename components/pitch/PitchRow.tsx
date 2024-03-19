import Player from "./Player";

export type PlayerData = {
  team_code: number;
  web_name: string;
  fixtures: {
    name: string;
    event: number;
  }[];
};

export function filterData(data: any, position: string): PlayerData[] {
  return data
    .filter((player: any) => {
      switch (position) {
        case "DEF":
          return player.fpl_player.element_type == 2 && player.position <= 11;
        case "MID":
          return player.fpl_player.element_type == 3 && player.position <= 11;
        case "FWD":
          return player.fpl_player.element_type == 4 && player.position <= 11;
        case "GK":
          return player.fpl_player.element_type == 1 && player.position <= 11;
        case "subs":
          return player.position > 11;
      }
    })
    .map((player: any) => {
      const home_fixtures = player.fpl_player.fpl_player_team.home_fixtures;
      const away_fixtures = player.fpl_player.fpl_player_team.away_fixtures;

      const combined: any[] = [];
      home_fixtures.map((fixture: any) => {
        combined.push({
          name: fixture.fpl_team_a.short_name,
          event: fixture.event,
        });
      });
      away_fixtures.map((fixture: any) => {
        combined.push({
          name: fixture.fpl_team_h.short_name.toLowerCase(),
          event: fixture.event,
        });
      });

      // for events with same value, combine into an array
      // concatentate both, sort by event
      const fixtures = combined.sort((a: any, b: any) => {
        return a.event - b.event;
      });

      return {
        team_code: player.fpl_player.team_code,
        web_name: player.fpl_player.web_name,
        team_name: player.fpl_player.fpl_player_team.short_name,
        fixtures: fixtures,
      };
    });
}

export default function PitchRow(props: {
  position: "DEF" | "MID" | "FWD" | "GK" | "subs";
  data: PlayerData[];
  gameweek: number;
}) {
  return props.position === "subs" ? (
    <div className="flex flex-row w-full h-1/5 items-center justify-around mt-5 bg-green-50 py-2">
      {props.data.map((player) => (
        <Player key={player.web_name} data={player} gameweek={props.gameweek} />
      ))}
    </div>
  ) : (
    <div className="flex flex-row w-full h-1/5 items-center justify-evenly py-2">
      {props.data.map((player: any) => (
        <Player key={player.web_name} data={player} gameweek={props.gameweek} />
      ))}
    </div>
  );
}

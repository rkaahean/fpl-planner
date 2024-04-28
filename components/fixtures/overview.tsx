import { getAllFixtures, getLatestGameweek } from "@/app/api";

export default async function Fixtures() {
  const data = await getAllFixtures();
  const max_gameweek = (await getLatestGameweek()!)._max.gameweek;

  const groupByHomeTeam = data.reduce<{
    [key: number]: { home: string; away: string; code: number }[];
  }>((acc, curr) => {
    const { event, team_h_id, team_a_id, ...rest } = curr;

    if (!acc[event]) {
      acc[event] = [];
    }
    acc[event].push({
      home: rest.fpl_team_h.short_name,
      away: rest.fpl_team_a.short_name,
      code: rest.code,
    });
    return acc;
  }, {});

  for (let i = max_gameweek!; i <= max_gameweek! + 4; i++) {}

  return (
    <div>
      <div className="text-sm font-black">Fixtures</div>
      {groupByHomeTeam[max_gameweek!].map((fixture) => {
        return (
          <div key={fixture.code}>
            {fixture.home} - {fixture.away}
          </div>
        );
      })}
    </div>
  );
}

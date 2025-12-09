import { Team, Award } from "./types";

const IMPACT_AWARD_TYPES = [0, 69]; // 0 = Chairman's, 69 = Impact
const BASE_URL = "https://www.thebluealliance.com/api/v3";

export async function validateApiKey(apiKey: string): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/status`, {
    headers: { "X-TBA-Auth-Key": apiKey }
  });
  return response.ok;
}

export async function findEvent(nameQuery: string, year: string, apiKey: string): Promise<any | null> {
  const response = await fetch(`${BASE_URL}/events/${year}`, {
    headers: { "X-TBA-Auth-Key": apiKey }
  });
  
  if (!response.ok) throw new Error("Failed to fetch events");
  
  const events = await response.json();
  const lowerQuery = nameQuery.toLowerCase();
  
  // Simple fuzzy match: check if query is in event name
  // Prioritize "Regional" or "District" matches
  const match = events.find((e: any) => e.name.toLowerCase().includes(lowerQuery));
  
  return match || null;
}

export async function getTeamsAtEvent(eventKey: string, apiKey: string): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/event/${eventKey}/teams`, {
    headers: { "X-TBA-Auth-Key": apiKey }
  });
  
  if (!response.ok) throw new Error("Failed to fetch teams");
  
  return await response.json();
}

export async function getTeamImpactHistory(teamKey: string, apiKey: string): Promise<Award[]> {
  const response = await fetch(`${BASE_URL}/team/${teamKey}/awards`, {
    headers: { "X-TBA-Auth-Key": apiKey }
  });
  
  if (!response.ok) return []; // Fail gracefully for individual teams
  
  const awards = await response.json();
  
  return awards.filter((award: any) => 
    IMPACT_AWARD_TYPES.includes(award.award_type) &&
    award.year >= 2022
  ).map((award: any) => ({
    name: award.name,
    year: award.year,
    event_key: award.event_key,
    award_type: award.award_type
  }));
}

export async function searchTeamsReal(regional: string, year: string, apiKey: string): Promise<Team[]> {
  // 1. Find Event
  const event = await findEvent(regional, year, apiKey);
  if (!event) throw new Error("Event not found. Try being more specific (e.g. 'Silicon Valley').");

  // 2. Get Teams
  const teams = await getTeamsAtEvent(event.key, apiKey);

  // 3. Get Awards for each team (Parallelized)
  // Limit concurrency to avoid hitting rate limits too hard, though client-side is usually per-IP
  const results = await Promise.all(
    teams.map(async (t: any) => {
      const awards = await getTeamImpactHistory(t.key, apiKey);
      if (awards.length === 0) return null;

      const team: Team = {
        team_number: t.team_number,
        nickname: t.nickname,
        city: t.city,
        state_prov: t.state_prov,
        country: t.country,
        website: t.website,
        awards: awards.sort((a, b) => b.year - a.year)
      };
      return team;
    })
  );

  return results.filter((t): t is Team => t !== null);
}

import { Team, Award } from "./types";

const IMPACT_AWARDS = [
  "Impact Award",
  "Chairman's Award",
  "Regional Impact Award",
  "Regional Chairman's Award",
  "District Impact Award",
  "District Chairman's Award",
  "Championship Impact Award",
  "Championship Chairman's Award"
];

// Helper for checking if award is an Impact/Chairman's award
const IMPACT_AWARD_TYPES = IMPACT_AWARDS; // Alias for consistency with real API logic

// Mock database of teams with relevant award history
const MOCK_TEAMS: Team[] = [
  {
    team_number: 254,
    nickname: "The Cheesy Poofs",
    city: "San Jose",
    state_prov: "California",
    country: "USA",
    website: "https://www.team254.com",
    awards: [
      { name: "Championship Chairman's Award", year: 2004, event: "Championship" },
      { name: "Regional Impact Award", year: 2023, event: "San Francisco Regional" }
    ]
  },
  {
    team_number: 1678,
    nickname: "Citrus Circuits",
    city: "Davis",
    state_prov: "California",
    country: "USA",
    website: "https://www.citruscircuits.org",
    awards: [
      { name: "Regional Chairman's Award", year: 2022, event: "Sacramento Regional" },
      { name: "Regional Impact Award", year: 2024, event: "Central Valley Regional" }
    ]
  },
  {
    team_number: 118,
    nickname: "Robonauts",
    city: "Houston",
    state_prov: "Texas",
    country: "USA",
    awards: []
  },
  {
    team_number: 148,
    nickname: "Robowranglers",
    city: "Greenville",
    state_prov: "Texas",
    country: "USA",
    awards: []
  },
  {
    team_number: 5985,
    nickname: "Project Bucephalus",
    city: "Wollongong",
    state_prov: "New South Wales",
    country: "Australia",
    awards: [
      { name: "Championship Impact Award", year: 2024, event: "FIRST Championship" },
      { name: "Regional Impact Award", year: 2023, event: "Southern Cross Regional" }
    ]
  },
  {
    team_number: 1114,
    nickname: "Simbotics",
    city: "St. Catharines",
    state_prov: "Ontario",
    country: "Canada",
    awards: [
      { name: "Championship Chairman's Award", year: 2012, event: "Championship" }
    ]
  },
  {
    team_number: 987,
    nickname: "High Rollers",
    city: "Las Vegas",
    state_prov: "Nevada",
    country: "USA",
    awards: [
        { name: "Championship Chairman's Award", year: 2016, event: "Championship" },
        { name: "Regional Impact Award", year: 2023, event: "Las Vegas Regional" }
    ]
  },
  {
    team_number: 27,
    nickname: "Team RUSH",
    city: "Clarkston",
    state_prov: "Michigan",
    country: "USA",
    awards: [
        { name: "Regional Impact Award", year: 2024, event: "Troy District" }
    ]
  }
];

export async function searchTeams(regional: string, year: string): Promise<Team[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // In a real app, this would fetch from TBA for the specific event
  // For now, we return a random subset of our mock teams to simulate "teams at this event"
  // And filter for those who have won Impact/Chairman's since 2022

  const teamsAtEvent = MOCK_TEAMS.filter(() => Math.random() > 0.3); // Randomly include teams

  return teamsAtEvent.map(team => {
    // Filter awards to only show relevant ones
    const relevantAwards = team.awards.filter(award => 
      IMPACT_AWARD_TYPES.includes(award.name) &&
      award.year >= 2022
    );
    
    return {
      ...team,
      awards: relevantAwards
    };
  }).filter(team => team.awards.length > 0); // Only return teams that have won
}

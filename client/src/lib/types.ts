export interface Award {
  name: string;
  year: number;
  event?: string;
  event_key?: string;
  award_type?: number;
}

export interface Team {
  team_number: number;
  nickname: string;
  city: string;
  state_prov: string;
  country: string;
  website?: string;
  awards: Award[];
}

export interface Ladder{
    pos: number; 
    team: string; 
    p: number; 
    w: number; 
    d: number; 
    l: number; 
    gd: number; 
    pts: number;
}

export interface Match{
    id: string | number;
    season_year: number;
    team_name: string;
    round: string;
    date_text: string;
    time_text: string;
    venue: string;
    w_score: string | null;
    opponent: string;
    a_score: string | null;
    last_updated: string;
    config_id: string| number| null;
}
export type MatchState = Match | 'OFF_SEASON' | null;

export interface News{
    id: string | number;
    title: string;
    content: string;
    published: boolean;
    created_at: string;
    updated_at: string;
    image_url: string;
}

export interface MediaItem{
    id: string;
    url: string; 
};
export interface Config{ 
    id: string; 
    season_year: number;
    team_name: string; 
};
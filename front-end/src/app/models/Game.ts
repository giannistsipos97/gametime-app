export interface Game {
  _id?: string;
  id: number;
  name: string;
  released?: string;
  background_image: string;
  rating: number;
  genres: { name: string }[];
  parent_platforms: { platform: { id: number; name: string } }[];
  platforms: { platform: { id: number; name: string; image_background: string } }[];
  category?: string;
  description?: string;
  description_raw: string;
  isPlayed?: boolean;
  inWishlist?: boolean;
  website?: string;
  stores?: { id: number; url?: string }[];
  developers?: { id: number; name: string }[];
  publishers?: { id: number; name: string }[];
  metacritic?: number;
  esrb_rating: { name: string };
  played: boolean;
  completedAt?: string;
  hoursPlayed?: number;
  platform?: string;
  playNext?: boolean;
  currentlyPlaying?: boolean;
}

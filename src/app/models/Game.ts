export interface Game {
  id: number;
  name: string;
  released?: string;
  background_image: string;
  rating: number;
  genres: { name: string }[];
  parent_platforms: { platform: { id: number; name: string } }[];
  platforms: { platform: { id: number; name: string; image_background: string } }[];
  category?: string; // optional fields
  // platforms?: string[];
  description?: string;
  description_raw: string;
  isPlayed?: boolean; // true if played
  inWishlist?: boolean; // true if in wishlist
  website?: string;
  developers?: { id: number; name: string }[];
  publishers?: { id: number; name: string }[];
  metacritic?: number;
  esrb_rating: { name: string };
  played: boolean;
  completedAt?: string;
  hoursPlayed?: number;
  platform?: string;
}

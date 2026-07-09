import { Injectable } from '@angular/core';
import { Game } from '../models/Game';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  saveLibrary(listType: string, games: Game[]): void {
    localStorage.setItem(listType, JSON.stringify(games));
  }

  getLibrary(listType: string): Game[] {
    const savedGames = localStorage.getItem(listType);

    if (!savedGames) {
      return [];
    }

    try {
      return JSON.parse(savedGames) as Game[];
    } catch {
      localStorage.removeItem(listType);
      return [];
    }
  }
}

import { Injectable } from '@angular/core';
import { Game } from '../models/Game';
import { STORAGE_KEYS } from '../constants/storage-keys';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // storage.service.ts
  saveLibrary(listType: string, games: Game[]): void {
    localStorage.setItem(listType, JSON.stringify(games));
  }

  getLibrary(listType: string): Game[] {
    return JSON.parse(localStorage.getItem(listType) || '[]');
  }

  moveGame(from: string, to: string, game: Game): void {
    const fromList = this.getLibrary(from);
    const toList = this.getLibrary(to);

    // remove from source
    const updatedFrom = fromList.filter((g) => g.id !== game.id);

    // add to target
    toList.push(game);

    this.saveLibrary(from, updatedFrom);
    this.saveLibrary(to, toList);
  }
}

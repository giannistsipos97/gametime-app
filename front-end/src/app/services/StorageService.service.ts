import { Injectable } from '@angular/core';
import { Game } from '../models/Game';
import { STORAGE_KEYS } from '../constants/storage-keys';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // storage.service.ts
  saveLibrary(listType: string, games: Game[]): void {
    localStorage.setItem(listType, JSON.stringify(games));
  }

  getLibrary(listType: string): Game[] {
    return JSON.parse(localStorage.getItem(listType) || '[]');
  }
}

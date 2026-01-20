// src/app/services/library.service.ts
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/Game';
import { StorageService } from './StorageService.service';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private readonly STORAGE_KEY = 'libraryGames';

  private libraryGamesSubject = new BehaviorSubject<Game[]>([]);
  libraryGames$ = this.libraryGamesSubject.asObservable();

  private libraryGames: Game[] = [];

  private storage = inject(StorageService);

  constructor() {
    // Load saved list from localStorage on startup
    this.libraryGames = this.storage.getLibrary(this.STORAGE_KEY);
    this.libraryGamesSubject.next(this.libraryGames);
  }

  addGame(game: Game) {
    if (!this.libraryGames.find((g) => g.id === game.id)) {
      this.libraryGames.push(game);
      this.saveAndEmit();
    }
  }

  removeFromLibrary(gameId: number) {
    this.libraryGames = this.libraryGames.filter((g) => g.id !== gameId);
    this.saveAndEmit();
  }

  getLibraryGames(): Game[] {
    return [...this.libraryGames];
  }

  hasGame(gameId: number): boolean {
    return this.libraryGames.some((g) => g.id === gameId);
  }

  setPlayed(game: Game, played: boolean, platform?: string, completedAt?: string, hoursPlayed?: number) {
    const index = this.libraryGames.findIndex((g) => g.id === game.id);

    if (index !== -1) {
      this.libraryGames[index] = {
        ...this.libraryGames[index],
        played: played,
        completedAt,
        hoursPlayed: hoursPlayed ?? this.libraryGames[index].hoursPlayed,
        platform: platform ?? this.libraryGames[index].platform,
      };

      this.saveAndEmit();
    }
  }

  // 🔥 Helper method to update localStorage + notify subscribers
  private saveAndEmit() {
    this.storage.saveLibrary(this.STORAGE_KEY, this.libraryGames);
    this.libraryGamesSubject.next([...this.libraryGames]);
  }
}

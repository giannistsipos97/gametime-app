// src/app/services/play-next.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/Game';
import { StorageService } from './StorageService.service';

@Injectable({ providedIn: 'root' })
export class PlayNextService {
  private readonly STORAGE_KEY = 'playNextGames';

  private playNextSubject = new BehaviorSubject<Game[]>([]);
  playNextGames$ = this.playNextSubject.asObservable();

  private playNextGames: Game[] = [];

  private storage = inject(StorageService);

  constructor() {
    // Load from localStorage on init
    this.playNextGames = this.storage.getLibrary(this.STORAGE_KEY) ?? [];
    this.playNextSubject.next(this.playNextGames);
  }

  addGame(game: Game) {
    if (!this.playNextGames.find((g) => g.id === game.id)) {
      this.playNextGames.push(game);
      this.saveAndEmit();
    }
  }

  removeGame(gameId: number) {
    this.playNextGames = this.playNextGames.filter((g) => g.id !== gameId);
    this.saveAndEmit();
  }

  hasGame(gameId: number): boolean {
    return this.playNextGames.some((g) => g.id === gameId);
  }

  getPlayNextGames(): Game[] {
    return [...this.playNextGames];
  }

  private saveAndEmit() {
    this.storage.saveLibrary(this.STORAGE_KEY, this.playNextGames);
    this.playNextSubject.next([...this.playNextGames]);
  }
}

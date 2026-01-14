import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/Game';
import { StorageService } from './StorageService.service';
import { LibraryService } from './LibraryService.service';

@Injectable({ providedIn: 'root' })
export class CurrentlyPlayingService {
  private readonly STORAGE_KEY = 'currentlyPlayingGames';

  private playingSubject = new BehaviorSubject<Game[]>([]);
  currentlyPlaying$ = this.playingSubject.asObservable();

  private playingGames: Game[] = [];

  private storage = inject(StorageService);
  private libraryService = inject(LibraryService);

  constructor() {
    this.playingGames = this.storage.getLibrary(this.STORAGE_KEY);
    this.playingSubject.next(this.playingGames);
  }

  finishGame(game: Game, completionDate: string, platform: string, hoursPlayed?: number) {
    // Mark as played and set date
    if (!this.libraryService.hasGame(game.id)) {
      this.libraryService.addGame(game);
    }
    this.libraryService.setPlayed(game, true, platform, completionDate, hoursPlayed);

    // Remove from currently playing
    this.removeGame(game.id);
  }

  addGame(game: Game) {
    if (!this.playingGames.find((g) => g.id === game.id)) {
      this.playingGames.push(game);
      this.saveAndEmit();
    }
  }

  removeGame(gameId: number) {
    this.playingGames = this.playingGames.filter((g) => g.id !== gameId);
    this.saveAndEmit();
  }

  hasGame(gameId: number) {
    return this.playingGames.some((g) => g.id === gameId);
  }

  getList() {
    return [...this.playingGames];
  }

  private saveAndEmit() {
    this.storage.saveLibrary(this.STORAGE_KEY, this.playingGames);
    this.playingSubject.next([...this.playingGames]);
  }
}

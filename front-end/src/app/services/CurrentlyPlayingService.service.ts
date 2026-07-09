import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/Game';
import { StorageService } from './StorageService.service';

@Injectable({ providedIn: 'root' })
export class CurrentlyPlayingService {
  private readonly STORAGE_KEY = 'currentlyPlayingGames';

  private playingSubject = new BehaviorSubject<Game[]>([]);
  currentlyPlaying$ = this.playingSubject.asObservable();

  private playingGames: Game[] = [];

  private storage = inject(StorageService);

  constructor() {
    this.playingGames = this.storage.getLibrary(this.STORAGE_KEY);
    this.playingSubject.next(this.playingGames);
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

  private saveAndEmit() {
    this.storage.saveLibrary(this.STORAGE_KEY, this.playingGames);
    this.playingSubject.next([...this.playingGames]);
  }
}

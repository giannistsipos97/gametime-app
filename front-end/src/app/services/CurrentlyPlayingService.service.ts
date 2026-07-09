import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/Game';
import { StorageService } from './StorageService.service';

@Injectable({ providedIn: 'root' })
export class CurrentlyPlayingService {
  private readonly STORAGE_KEY = 'currentlyPlayingGames';

  private playingSubject = new BehaviorSubject<Game[]>([]);
  currentlyPlaying$ = this.playingSubject.asObservable();

  private storage = inject(StorageService);

  constructor() {
    this.playingSubject.next(this.storage.getLibrary(this.STORAGE_KEY));
  }

  addGame(game: Game) {
    if (!this.playingSubject.value.some((g) => g.id === game.id)) {
      this.saveAndEmit([...this.playingSubject.value, game]);
    }
  }

  removeGame(gameId: number) {
    this.saveAndEmit(this.playingSubject.value.filter((g) => g.id !== gameId));
  }

  private saveAndEmit(games: Game[]) {
    this.storage.saveLibrary(this.STORAGE_KEY, games);
    this.playingSubject.next(games);
  }
}

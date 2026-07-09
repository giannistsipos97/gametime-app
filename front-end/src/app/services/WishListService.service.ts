import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/Game';
import { StorageService } from './StorageService.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly STORAGE_KEY = 'wishlistGames';

  private wishlistGamesSubject = new BehaviorSubject<Game[]>([]);
  wishlistGames$ = this.wishlistGamesSubject.asObservable();

  private storage = inject(StorageService);

  constructor() {
    this.wishlistGamesSubject.next(this.storage.getLibrary(this.STORAGE_KEY));
  }

  addGame(game: Game) {
    if (!this.hasGame(game.id)) {
      this.saveAndEmit([...this.wishlistGamesSubject.value, game]);
    }
  }

  removeGame(id: number) {
    this.saveAndEmit(this.wishlistGamesSubject.value.filter((g) => g.id !== id));
  }

  hasGame(gameId: number): boolean {
    return this.wishlistGamesSubject.value.some((g) => g.id === gameId);
  }

  private saveAndEmit(games: Game[]) {
    this.storage.saveLibrary(this.STORAGE_KEY, games);
    this.wishlistGamesSubject.next(games);
  }
}

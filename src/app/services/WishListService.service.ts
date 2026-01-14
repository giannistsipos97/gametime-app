import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/Game';
import { StorageService } from './StorageService.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly STORAGE_KEY = 'wishlistGames';

  private wishlistGamesSubject = new BehaviorSubject<Game[]>([]);
  wishlistGames$ = this.wishlistGamesSubject.asObservable();

  private wishlistGames: Game[] = [];

  private storage = inject(StorageService);

  constructor() {
    this.wishlistGames = this.storage.getLibrary(this.STORAGE_KEY);
    this.wishlistGamesSubject.next(this.wishlistGames);
  }

  addGame(game: Game) {
    if (!this.wishlistGames.find((g) => g.id === game.id)) {
      this.wishlistGames.push(game);
      this.saveAndEmit();
    }
  }

  removeGame(id: number) {
    this.wishlistGames = this.wishlistGames.filter((g) => g.id !== id);
    this.saveAndEmit();
  }

  hasGame(gameId: number): boolean {
    return this.wishlistGames.some((g) => g.id === gameId);
  }

  getWishlistGames(): Game[] {
    return [...this.wishlistGames];
  }

  private saveAndEmit() {
    this.storage.saveLibrary(this.STORAGE_KEY, this.wishlistGames);
    this.wishlistGamesSubject.next([...this.wishlistGames]);
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Game } from '../models/Game';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GameService {
  private apiUrl = `${environment.rawgApiUrl}/games`;
  private apiKey = environment.rawgApiKey;
  private http = inject(HttpClient);
  private detailsCache = new Map<number, Observable<Game>>();
  private storesCache = new Map<number, Observable<any>>();
  private screenshotsCache = new Map<number, Observable<any>>();

  getGameDetails(id: number): Observable<Game> {
    if (!this.detailsCache.has(id)) {
      this.detailsCache.set(id, this.http.get<Game>(`${this.apiUrl}/${id}?key=${this.apiKey}`).pipe(shareReplay(1)));
    }

    return this.detailsCache.get(id)!;
  }

  searchGames(searchQuery: string = ''): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&page_size=10${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`;
    return this.http.get<any>(url);
  }

  getGameStores(gameId: number): Observable<any> {
    if (!this.storesCache.has(gameId)) {
      this.storesCache.set(
        gameId,
        this.http.get(`https://api.rawg.io/api/games/${gameId}/stores?key=${this.apiKey}`).pipe(shareReplay(1)),
      );
    }

    return this.storesCache.get(gameId)!;
  }

  getScreenshotsOfGame(gameId: number): Observable<any> {
    if (!this.screenshotsCache.has(gameId)) {
      this.screenshotsCache.set(
        gameId,
        this.http.get(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${this.apiKey}`).pipe(shareReplay(1)),
      );
    }

    return this.screenshotsCache.get(gameId)!;
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/Game';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameService {
  private apiUrl = `${environment.rawgApiUrl}/games`;
  private apiKey = environment.rawgApiKey;
  private http = inject(HttpClient);

  getPopularGames(): Observable<{ results: Game[] }> {
    return this.http.get<{ results: Game[] }>(`${this.apiUrl}?key=${this.apiKey}&page_size=4&ordering=-added`).pipe(
      catchError((err) => {
        console.error('Error fetching popular games', err);
        return throwError(() => err);
      }),
    );
  }

  getLibrary(): Observable<{ results: Game[] }> {
    return this.http.get<{ results: Game[] }>(`${this.apiUrl}?key=${this.apiKey}&page_size=20&ordering=-added`).pipe(
      catchError((err) => {
        console.error('Error fetching popular games', err);
        return throwError(() => err);
      }),
    );
  }

  getGameDetails(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}?key=${this.apiKey}`);
  }

  searchGames(searchQuery: string = ''): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}${searchQuery ? `&search=${searchQuery}` : ''}`;
    return this.http.get<any>(url);
  }

  getGameStores(gameId: number): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/games/${gameId}/stores?key=${this.apiKey}`);
  }

  getScreenshotsOfGame(gameId: number): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${this.apiKey}`);
  }
}

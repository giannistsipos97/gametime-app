import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, map, Observable, of, shareReplay, tap, throwError, EMPTY } from 'rxjs';
import { Game } from '../models/Game';
import { ENDPOINTS } from '../constants/endpoints';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  // This is your Source of Truth
  private libraryGamesSubject = new BehaviorSubject<Game[]>([]);
  libraryGames$ = this.libraryGamesSubject.asObservable();

  playNextGames$ = this.libraryGames$.pipe(map((games) => games.filter((g) => g.playNext)));
  libraryIds$ = this.libraryGames$.pipe(map((games) => new Set(games.map((game) => game.id))));

  private hasLoadedLibrary = false;
  private loadLibraryRequest$?: Observable<Game[]>;

  private setLibraryGames(games: Game[]): Game[] {
    this.libraryGamesSubject.next(games);
    this.hasLoadedLibrary = true;
    return games;
  }

  private upsertLocalGame(savedGame: Game): Game[] {
    const games = this.libraryGamesSubject.value;
    const existingIndex = games.findIndex((game) => game._id === savedGame._id || game.id === savedGame.id);
    const updatedGames =
      existingIndex >= 0
        ? games.map((game, index) => (index === existingIndex ? savedGame : game))
        : [...games, savedGame];

    return this.setLibraryGames(updatedGames);
  }

  // GET: Load from MongoDB
  loadLibrary(forceRefresh = false): Observable<Game[]> {
    if (!localStorage.getItem('token')) {
      this.clear();
      return of([]);
    }

    if (!forceRefresh && this.hasLoadedLibrary) {
      return of(this.libraryGamesSubject.value);
    }

    if (!forceRefresh && this.loadLibraryRequest$) {
      return this.loadLibraryRequest$;
    }

    this.loadLibraryRequest$ = this.http.get<Game[]>(ENDPOINTS.LIBRARY.LIBRARY).pipe(
      tap((games) => {
        this.setLibraryGames(games);
      }),
      catchError((err) => {
        console.error('Could not load library', err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadLibraryRequest$ = undefined;
      }),
      shareReplay(1),
    );

    return this.loadLibraryRequest$;
  }

  // POST: Add to MongoDB
  addGame(game: Game): Observable<Game[]> {
    // 1. Check if game exists
    if (this.hasGame(game.id)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Game Already in Library',
        detail: 'This game is already in your library.',
      });
      // 2. Return an empty observable so the component subscription still works
      return EMPTY;
    }

    // 3. Otherwise, proceed with the POST
    return this.http.post<Game>(ENDPOINTS.LIBRARY.LIBRARY, game).pipe(
      map((savedGame) => this.upsertLocalGame(savedGame)),
      catchError((err) => {
        console.error('Add failed', err);
        return throwError(() => err);
      }),
    );
  }

  // DELETE: Remove from MongoDB
  // 1. Return the Observable so the component can subscribe
  removeFromLibrary(mongoId: string): Observable<Game[]> {
    return this.http.delete(`${ENDPOINTS.LIBRARY.LIBRARY}/${mongoId}`).pipe(
      map(() => this.setLibraryGames(this.libraryGamesSubject.value.filter((game) => game._id !== mongoId))),
      catchError((err) => {
        console.error('Delete failed', err);
        return throwError(() => err);
      }),
    );
  }

  // UPDATED hasGame: Looks at the current value of the Subject
  hasGame(gameId: number): boolean {
    return this.libraryGamesSubject.value.some((g) => g.id === gameId);
  }

  // library.service.ts
  // library.service.ts

  setPlayed(
    game: any,
    played: boolean,
    platform?: string,
    completedAt?: string,
    hoursPlayed?: number,
  ): Observable<Game[]> {
    const url = `${ENDPOINTS.LIBRARY.LIBRARY}/sync/${game.id}`;

    const updateData = {
      id: game.id,
      name: game.name,
      thumbnail: game.thumbnail || game.background_image,
      background_image: game.background_image,
      metacritic: game.metacritic,
      rating: game.rating,
      played: played,
      platform: played ? (platform ?? game.platform) : null,
      completedAt: played ? (completedAt ?? game.completedAt) : null,
      hoursPlayed: played ? (hoursPlayed ?? game.hoursPlayed) : null,
    };

    // 1. Return the observable chain
    return this.http.put<Game>(url, updateData).pipe(
      map((savedGame) => this.upsertLocalGame(savedGame)),
      catchError((err) => {
        console.error('Sync failed', err);
        return throwError(() => err);
      }),
    );
  }

  clear() {
    this.hasLoadedLibrary = false;
    this.loadLibraryRequest$ = undefined;
    this.libraryGamesSubject.next([]);
  }

  togglePlayNext(game: Game): Observable<Game[]> {
    // Use the MongoDB _id
    return this.http.patch<Game>(`${ENDPOINTS.LIBRARY.LIBRARY}/${game._id}/play-next`, {}).pipe(
      map((savedGame) => this.upsertLocalGame(savedGame)),
      catchError((err) => {
        console.error('Toggle Play Next failed', err);
        return throwError(() => err);
      }),
    );
  }

}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError, of, EMPTY } from 'rxjs';
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

  constructor() {}

  // GET: Load from MongoDB
  loadLibrary(): Observable<Game[]> {
    // 1. Add 'return' so the component can "see" the call
    return this.http.get<Game[]>(ENDPOINTS.LIBRARY.LIBRARY).pipe(
      // 2. Use 'tap' to update your Subject without "consuming" the data here
      tap((games) => {
        this.libraryGamesSubject.next(games);
      }),
      catchError((err) => {
        console.error('Could not load library', err);
        return throwError(() => err);
      }),
    );
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
      switchMap(() => this.loadLibrary()),
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
      // 2. Once deleted, switch to the loadLibrary call to refresh the state
      switchMap(() => this.loadLibrary()),
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
      title: game.title || game.name,
      thumbnail: game.thumbnail || game.background_image,
      played: played,
      platform: played ? (platform ?? game.platform) : null,
      completedAt: played ? (completedAt ?? game.completedAt) : null,
      hoursPlayed: played ? (hoursPlayed ?? game.hoursPlayed) : null,
    };

    // 1. Return the observable chain
    return this.http.put<Game[]>(url, updateData).pipe(
      // 2. Refresh the library state after the sync is successful
      switchMap(() => this.loadLibrary()),
      catchError((err) => {
        console.error('Sync failed', err);
        return throwError(() => err);
      }),
    );
  }

  clear() {
    this.libraryGamesSubject.next([]);
  }

  togglePlayNext(game: any) {
    // Use the MongoDB _id
    return this.http.patch(`${ENDPOINTS.LIBRARY.LIBRARY}/${game._id}/play-next`, {}).subscribe({
      next: () => this.loadLibrary(), // Refresh the whole state
      error: (err) => console.error('Toggle Play Next failed', err),
    });
  }

  isInPlayNext(id: number): boolean {
    return this.libraryGamesSubject.value.some((g) => g.id === id && g.playNext);
  }
}

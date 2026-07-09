import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { GameService } from '../../services/GameService.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';
import { PlatformIconPipe } from '../../pipes/platform-icon.pipe';
import { Tooltip } from 'primeng/tooltip';
import { catchError, debounceTime, distinctUntilChanged, map, Subject, switchMap, of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { LibraryService } from '../../services/LibraryService.service';
import { Game } from '../../models/Game';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    PopoverModule,
    PlatformIconPipe,
    Tooltip,
    RouterModule,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchComponent implements OnInit {
  private gameService = inject(GameService);
  private libraryService = inject(LibraryService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  private searchSubject = new Subject<string>();
  searchQuery: string = '';
  data: any;
  libraryIds = new Set<number>();

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query) => {
          const trimmedQuery = query.trim();
          return trimmedQuery
            ? this.gameService.searchGames(trimmedQuery).pipe(
                map((res) => res.results),
                catchError(() => of([])),
              )
            : of([]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((results) => {
        this.data = results;
      });

    this.libraryService.libraryIds$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ids) => {
      this.libraryIds = ids;
    });
  }

  onSearch(query: string) {
    // Emit the current searchQuery to the subject
    this.searchSubject.next(query);
  }

  clearSearch() {
    this.searchQuery = '';
    this.data = [];
  }

  selectGame(game: any) {
    this.searchQuery = game.name;
    this.data = [];
  }

  addToLibrary(game: Game) {
    this.libraryService.addGame(game).subscribe({
      next: (updatedLibrary) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added to Library',
          detail: `${game.name} is now in your library!`,
        });
      },
    });
  }

}

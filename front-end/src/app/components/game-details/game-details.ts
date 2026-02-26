import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GameService } from '../../services/GameService.service';
import { Game } from '../../models/Game';
import { PlatformIconPipe } from '../../pipes/platform-icon.pipe';
import { CommonModule } from '@angular/common';
import { LibraryService } from '../../services/LibraryService.service';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { EsrbAgePipe } from '../../pipes/EsrbAge.pipe';
import { combineLatest, forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { FindStoreByUrlPipe } from '../../pipes/findStoreByUrl.pipe';
import { GalleriaModule } from 'primeng/galleria';
import { TooltipModule } from 'primeng/tooltip';
import { BeforeSpanishPipe } from '../../pipes/BeforeSpanish.pipe';
import { WishlistService } from '../../services/WishListService.service';
import { TruncateTextComponent } from '../truncate-text/truncate-text';
import { MessageService } from 'primeng/api';
import { CompleteDialogComponent } from '../complete-dialog/complete-dialog';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [
    PlatformIconPipe,
    CommonModule,
    PanelModule,
    TagModule,
    ChipModule,
    EsrbAgePipe,
    FindStoreByUrlPipe,
    GalleriaModule,
    TooltipModule,
    BeforeSpanishPipe,
    TruncateTextComponent,
    CompleteDialogComponent,
  ],
  templateUrl: './game-details.html',
  styleUrl: './game-details.scss',
})
export class GameDetailsComponent implements OnInit {
  private routeParam = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private libraryService = inject(LibraryService);
  private wishlistService = inject(WishlistService);
  private messageService = inject(MessageService);

  gameId!: number;
  game!: Game;
  gameInLibrary: Game | null = null;
  stores: any[] = [];
  screenshots: any[] = [];
  private destroy$ = new Subject<void>();
  displayCompletedDialog: boolean = false;

  ngOnInit(): void {
    this.routeParam.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params: ParamMap) => {
      const idParam = params.get('id');
      if (!idParam) return;

      const gameId = Number(idParam);
      if (isNaN(gameId)) return;

      combineLatest({
        data: forkJoin({
          details: this.gameService.getGameDetails(gameId),
          stores: this.gameService.getGameStores(gameId),
          screenshots: this.gameService.getScreenshotsOfGame(gameId),
        }),
        library: this.libraryService.libraryGames$, // Listen to the library stream
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ({ data, library }) => {
            this.game = data.details;
            // ... assign stores and screenshots ...

            // This will now update automatically if the library loads later
            // or if the user adds the game while on this page!
            this.gameInLibrary = library.find((g) => g.id === this.game.id) || null;
          },
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // checkIfLibrary(): boolean {
  //   if (this.libraryService.getLibraryGames().find((game) => game.id === this.game.id)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // hoursPlayed(gameId: number): number {
  //   const gameInLibrary = this.libraryService.getLibraryGames().find((game) => game.id === gameId);
  //   return gameInLibrary?.hoursPlayed || 0;
  // }

  // platformPlayedOn(gameId: number) {
  //   const gameInLibrary = this.libraryService.getLibraryGames().find((game) => game.id === gameId);
  //   return gameInLibrary?.platform || 'N/A';
  // }

  // checkIfPlayed(): boolean {
  //   const gameInLibrary = this.libraryService.getLibraryGames().find((game) => game.id === this.game.id);

  //   return !!gameInLibrary?.played; // true if played === true, false otherwise
  // }

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

  isInWishlist(gameId: number): boolean {
    return this.wishlistService.hasGame(gameId);
  }

  addToWishlist(game: Game) {
    this.wishlistService.addGame(game);
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Wishlist',
      detail: `${game.name} is now on your wishlist!`,
    });
  }

  removeFromWishlist(id: number) {
    this.wishlistService.removeGame(id);
    this.messageService.add({
      severity: 'warn',
      summary: 'Removed',
      detail: 'Game removed from wishlist',
    });
  }

  updatePlayed(game: Game) {
    // 1. Calculate the new state
    const newValue = !game.played;

    // 2. Call the service and SUBSCRIBE
    this.libraryService.setPlayed(game, newValue).subscribe({
      next: () => {
        // 3. Success Feedback
        this.messageService.add({
          severity: newValue ? 'success' : 'warn',
          summary: newValue ? 'Marked as Played' : 'Back to Backlog',
          detail: newValue ? 'Great job finishing the game!' : 'Removed from played.',
        });

        // Note: We don't need 'game.played = newValue' here anymore
        // because loadLibrary() inside the service refreshes the whole list.
      },
      error: (err) => {
        // 4. If it fails, the UI stays as it was
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Could not sync with the database.',
        });
      },
    });
  }

  removeFromLibrary() {
    // 1. Capture the name and ID IMMEDIATELY
    const nameToDisplay = this.gameInLibrary?.name || 'Game';
    const idToDelete = this.gameInLibrary?._id;

    if (!idToDelete) return;

    // 2. Start the service call
    this.libraryService.removeFromLibrary(idToDelete).subscribe({
      next: () => {
        // 3. Use the local 'nameToDisplay' variable, NOT 'this.gameInLibrary'
        this.messageService.add({
          severity: 'info',
          summary: 'Removed',
          detail: `${nameToDisplay} was removed from your library`,
        });
      },
      error: (err) => console.error(err),
    });
  }
}

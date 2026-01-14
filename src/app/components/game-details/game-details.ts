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
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
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
    // Subscribe to paramMap so we react when :id changes
    this.routeParam.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params: ParamMap) => {
      const idParam = params.get('id');
      if (!idParam) return;

      const gameId = Number(idParam);
      if (isNaN(gameId)) return;

      // Fetch details + stores + screenshots for this id
      forkJoin({
        details: this.gameService.getGameDetails(gameId),
        stores: this.gameService.getGameStores(gameId),
        screenshots: this.gameService.getScreenshotsOfGame(gameId),
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ({ details, stores, screenshots }) => {
            this.game = details;
            this.stores = (stores && (stores.results || stores)) || [];
            this.screenshots = (screenshots && (screenshots.results || screenshots)) || [];
            this.gameInLibrary = this.libraryService.getLibraryGames().find((game) => game.id === this.game.id) || null;
            console.log('gameInLibrary.played => ', this.gameInLibrary?.played);
            console.log('gameInLibrary.platform => ', this.gameInLibrary?.platform);
            console.log('gameInLibrary.hoursPlayed => ', this.gameInLibrary?.hoursPlayed);

            // console.log('game => ', this.game.played);
          },
          error: (err) => {
            console.error('Error loading game details', err);
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
    this.libraryService.addGame(game);
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Library',
      detail: `${game.name} is now in your library!`,
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
    const newValue = !this.gameInLibrary?.played;
    this.libraryService.setPlayed(game, newValue);
    game.played = newValue; // update UI immediately
    this.messageService.add({
      severity: newValue ? 'success' : 'warn',
      summary: newValue ? 'Marked as Played' : 'Back to Backlog',
      detail: newValue ? 'Great job finishing the game!' : 'Removed from played!.',
    });
  }

  removeFromLibrary(game: Game) {
    this.libraryService.removeFromLibrary(game.id);
    this.messageService.add({
      severity: 'info',
      summary: 'Removed',
      detail: 'Game removed from Library',
    });
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { combineLatest, distinctUntilChanged, filter, forkJoin, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { FindStoreByUrlPipe } from '../../pipes/findStoreByUrl.pipe';
import { GalleriaModule } from 'primeng/galleria';
import { TooltipModule } from 'primeng/tooltip';
import { BeforeSpanishPipe } from '../../pipes/BeforeSpanish.pipe';
import { WishlistService } from '../../services/WishListService.service';
import { TruncateTextComponent } from '../truncate-text/truncate-text';
import { MessageService } from 'primeng/api';
import { CompleteDialogComponent } from '../complete-dialog/complete-dialog';

type StoreLink = {
  id: number;
  url: string;
};

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
export class GameDetailsComponent implements OnInit, OnDestroy {
  private routeParam = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private libraryService = inject(LibraryService);
  private wishlistService = inject(WishlistService);
  private messageService = inject(MessageService);

  gameId!: number;
  game!: Game;
  gameInLibrary: Game | null = null;
  stores: StoreLink[] = [];
  screenshots: any[] = [];
  private destroy$ = new Subject<void>();
  displayCompletedDialog = false;
  isWishlisted = false;

  ngOnInit(): void {
    this.libraryService.loadLibrary().pipe(takeUntil(this.destroy$)).subscribe();

    this.routeParam.paramMap
      .pipe(
        map((params: ParamMap) => Number(params.get('id'))),
        filter((gameId) => !isNaN(gameId)),
        distinctUntilChanged(),
        switchMap((gameId) =>
          forkJoin({
            details: this.gameService.getGameDetails(gameId),
            screenshots: this.gameService.getScreenshotsOfGame(gameId),
          }).pipe(
            switchMap(({ details, screenshots }) => {
              const storesFromDetails = this.getStoresFromDetails(details);
              const stores$ = storesFromDetails.length
                ? of(storesFromDetails)
                : this.gameService.getGameStores(gameId).pipe(map((stores) => stores.results ?? []));

              return combineLatest({
                data: forkJoin({
                  details: of(details),
                  stores: stores$,
                  screenshots: of(screenshots),
                }),
                library: this.libraryService.libraryGames$,
                wishlist: this.wishlistService.wishlistGames$,
              });
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: ({ data, library, wishlist }) => {
          this.game = data.details;
          this.stores = data.stores;
          this.screenshots = data.screenshots.results ?? [];
          this.gameInLibrary = library.find((g) => g.id === this.game.id) || null;
          this.isWishlisted = wishlist.some((g) => g.id === this.game.id);
        },
      });
  }

  private getStoresFromDetails(game: Game): StoreLink[] {
    return (
      game.stores
        ?.filter((store): store is StoreLink => !!store.url)
        .map((store) => ({
          id: store.id,
          url: store.url,
        })) ?? []
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addToLibrary(game: Game) {
    this.libraryService.addGame(game).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added to Library',
          detail: `${game.name} is now in your library!`,
        });
      },
    });
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
    const newValue = !game.played;

    this.libraryService.setPlayed(game, newValue).subscribe({
      next: () => {
        this.messageService.add({
          severity: newValue ? 'success' : 'warn',
          summary: newValue ? 'Marked as Played' : 'Back to Backlog',
          detail: newValue ? 'Great job finishing the game!' : 'Removed from played.',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Could not sync with the database.',
        });
      },
    });
  }

  onGameCompleted(game: Game) {
    this.gameInLibrary = this.gameInLibrary ? { ...this.gameInLibrary, ...game } : game;
  }

  removeFromLibrary() {
    const nameToDisplay = this.gameInLibrary?.name || 'Game';
    const idToDelete = this.gameInLibrary?._id;

    if (!idToDelete) return;

    this.libraryService.removeFromLibrary(idToDelete).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Removed',
          detail: `${nameToDisplay} was removed from your library`,
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}

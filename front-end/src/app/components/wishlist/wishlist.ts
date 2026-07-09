import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { WishlistService } from '../../services/WishListService.service';
import { LibraryService } from '../../services/LibraryService.service';
import { Game } from '../../models/Game';
import { PlatformIconPipe } from '../../pipes/platform-icon.pipe';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterModule, DataViewModule, CommonModule, ButtonModule, TooltipModule, PlatformIconPipe],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  public libraryService = inject(LibraryService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  wishlistGames: Game[] = [];

  ngOnInit() {
    this.wishlistService.wishlistGames$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((games) => {
      this.wishlistGames = games;
    });
  }

  addToLibrary(game: Game) {
    this.libraryService.addGame(game).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added to Library',
          detail: `${game.name} is now in your library!`,
        });
        this.removeFromWishlist(game.id);
      },
    });
  }

  removeFromWishlist(id: number) {
    this.wishlistService.removeGame(id);
  }
}

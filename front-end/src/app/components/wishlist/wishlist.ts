import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { WishlistService } from '../../services/WishListService.service';
import { LibraryService } from '../../services/LibraryService.service';
import { Game } from '../../models/Game';
import { PlatformIconPipe } from '../../pipes/platform-icon.pipe';
import { RouterModule } from '@angular/router';

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

  wishlistGames: Game[] = [];

  constructor() {}

  ngOnInit() {
    this.wishlistGames = this.wishlistService.getWishlistGames();

    // Subscribe if wishlist changes dynamically
    this.wishlistService.wishlistGames$.subscribe((games) => {
      this.wishlistGames = games;
    });

    console.log(this.wishlistGames);
  }

  addToLibrary(game: Game) {
    this.libraryService.addGame(game);
    this.removeFromWishlist(game.id);
  }

  removeFromWishlist(id: number) {
    this.wishlistService.removeGame(id);
  }
}

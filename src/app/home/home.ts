import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../services/GameService.service';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { CarouselModule } from 'primeng/carousel';
import { PaginatorModule } from 'primeng/paginator';
import { PlatformIconPipe } from '../pipes/platform-icon.pipe';
import { Tooltip } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { PlayNextService } from '../services/PlayNextService.service';
import { Game } from '../models/Game';
import { CurrentlyPlayingService } from '../services/CurrentlyPlayingService.service';
import { CompleteDialogComponent } from '../components/complete-dialog/complete-dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AsyncPipe, CommonModule } from '@angular/common';
// import { LibraryService } from '../services/LibraryService.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardModule,
    ChipModule,
    CarouselModule,
    PaginatorModule,
    PlatformIconPipe,
    Tooltip,
    RouterModule,
    CompleteDialogComponent,
    ToastModule,
    AsyncPipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  // private gameService = inject(GameService);
  private playNextService = inject(PlayNextService);
  private currentlyPlayingService = inject(CurrentlyPlayingService);
  private messageService = inject(MessageService);
  // private libraryService = inject(LibraryService);

  games: Game[] = [];
  playnextGames: Game[] = [];
  displayCompletedDialog: boolean = false;
  selectedGame: Game | null = null;

  currentlyPlaying$ = this.currentlyPlayingService.currentlyPlaying$;

  ngOnInit(): void {
    this.currentlyPlayingService.getList();
    this.playnextGames = this.playNextService.getPlayNextGames();
    // this.libraryService.getLibraryGames().find((game) => game.id === )
  }

  addToPlaying(game: Game) {
    this.currentlyPlayingService.addGame(game);
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Currently Playing',
      detail: `${game.name} is now in your currently playing list!`,
    });
    this.removeFromPlayNext(game);
  }

  removeFromPlaying(game: Game) {
    this.currentlyPlayingService.removeGame(game.id);
    this.messageService.add({
      severity: 'warn',
      summary: 'Removed from Currently Playing',
      detail: `${game.name} is removed from your currently playing list!`,
    });
    this.currentlyPlayingService.getList();
  }

  removeFromPlayNext(game: Game) {
    this.playNextService.removeGame(game.id);
    this.messageService.add({
      severity: 'warn',
      summary: 'Removed from Play Next',
      detail: `${game.name} is removed from your Play Next list!`,
    });
    this.playnextGames = this.playNextService.getPlayNextGames();
  }

  finish(game: Game) {
    this.selectedGame = game;
    this.displayCompletedDialog = true;
    // update UI immediately
    // this.games = this.games.filter((g) => g.id !== game.id);
  }
}

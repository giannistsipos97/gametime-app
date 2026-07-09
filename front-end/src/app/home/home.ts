import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { PlatformIconPipe } from '../pipes/platform-icon.pipe';
import { Tooltip } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { Game } from '../models/Game';
import { CurrentlyPlayingService } from '../services/CurrentlyPlayingService.service';
import { CompleteDialogComponent } from '../components/complete-dialog/complete-dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AsyncPipe } from '@angular/common';
import { LibraryService } from '../services/LibraryService.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardModule,
    ChipModule,
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
  private currentlyPlayingService = inject(CurrentlyPlayingService);
  private messageService = inject(MessageService);
  private libraryService = inject(LibraryService);

  displayCompletedDialog: boolean = false;
  selectedGame: Game | null = null;

  currentlyPlaying$ = this.currentlyPlayingService.currentlyPlaying$;
  playNextGames$ = this.libraryService.playNextGames$;

  ngOnInit(): void {
    this.libraryService.loadLibrary().subscribe();
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
  }

  removeFromPlayNext(game: Game) {
    this.libraryService.togglePlayNext(game).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Removed from Play Next',
          detail: `${game.name} is removed from your Play Next list!`,
        });
      },
    });
  }

  finish(game: Game) {
    this.selectedGame = game;
    this.displayCompletedDialog = true;
  }
}

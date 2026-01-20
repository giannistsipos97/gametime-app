import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Game } from '../../models/Game';
import { LibraryService } from '../../services/LibraryService.service';
import { PlayNextService } from '../../services/PlayNextService.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PLATFORMS } from '../../constants/platforms.const';
import { CompleteDialogComponent } from '../complete-dialog/complete-dialog';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    CardModule,
    MultiSelectModule,
    TooltipModule,
    RouterModule,
    ConfirmDialogModule,
    CompleteDialogComponent,
  ],
  templateUrl: './library.html',
  styleUrls: ['./library.scss'],
})
export class LibraryComponent implements OnInit {
  private libraryService = inject(LibraryService);
  private playNextService = inject(PlayNextService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  // Use the observable directly in the template with async pipe
  libraryGames$ = this.libraryService.libraryGames$;

  platforms = PLATFORMS;

  playedOptions: any[] = [
    { label: 'Played', value: 'played' },
    { label: 'Not Played', value: 'notplayed' },
  ];

  displayCompletedDialog: boolean = false;
  selectedGame: Game | null = null;

  ngOnInit(): void {
    // No need to manually subscribe unless you need synchronous array in component
    // You can still subscribe if you want a local copy:
    // this.libraryService.libraryGames$.subscribe(games => this.games = games);
  }

  playNext(game: Game) {
    this.playNextService.addGame(game);
  }

  isInPlayNext(gameId: number): boolean {
    return this.playNextService.hasGame(gameId);
  }

  confirmPlayNext(game: Game) {
    if (this.isInPlayNext(game.id)) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to remove this game from your play next list?',
        header: 'Remove from Play Next Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.playNextService.removeGame(game.id);
          this.messageService.add({
            severity: 'warn',
            summary: 'Removed from Play Next',
            detail: 'Game removed from play next list',
          });
        },
      });
    } else {
      this.confirmationService.confirm({
        message: 'Are you sure you want to add this game for playing next?',
        header: 'Play Next Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.playNextService.addGame(game);
          this.messageService.add({
            severity: 'success',
            summary: 'Added to Play Next',
            detail: 'Game added to play next list',
          });
        },
      });
    }
  }

  confirmPlayed(game: Game) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to make this game unplayed?',
      header: 'Unplayed Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.libraryService.setPlayed(game, false);
        game.played = false; // update UI immediately
        this.messageService.add({
          severity: 'warn',
          summary: 'Back to Backlog',
          detail: 'Moved back to your collection.',
        });
      },
    });
  }

  displayDialog(game: Game) {
    this.selectedGame = game;
    this.displayCompletedDialog = true;
  }

  updateGame(game: Game) {
    this.libraryService.setPlayed(game, true, game.platform);
    game.played = true; // update UI immediately
    this.messageService.add({
      severity: 'success',
      summary: 'Marked as Played',
      detail: 'Great job finishing the game!',
    });
  }

  confirmDelete(game: Game) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this game from your library?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.libraryService.removeFromLibrary(game.id);
        this.messageService.add({
          severity: 'warn',
          summary: 'Remove from played',
          detail: 'Game removed from played',
        });
      },
    });
  }
}

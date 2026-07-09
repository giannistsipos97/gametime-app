import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Game } from '../../models/Game';
import { LibraryService } from '../../services/LibraryService.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PLATFORMS } from '../../constants/platforms.const';
import { CompleteDialogComponent } from '../complete-dialog/complete-dialog';

type PlayedFilter = 'played' | 'notplayed';

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
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  // Use the observable directly in the template with async pipe
  libraryGames$ = this.libraryService.libraryGames$;

  platforms = PLATFORMS;

  playedOptions: { label: string; value: PlayedFilter }[] = [
    { label: 'Played', value: 'played' },
    { label: 'Not Played', value: 'notplayed' },
  ];

  displayCompletedDialog = false;
  selectedGame: Game | null = null;
  playNextGames$ = this.libraryService.playNextGames$;

  ngOnInit(): void {
    this.libraryService.loadLibrary().subscribe();
  }

  confirmPlayNext(game: Game) {
    const isRemoving = !!game.playNext;

    this.confirmationService.confirm({
      message: isRemoving
        ? 'Are you sure you want to remove this game from your play next list?'
        : 'Are you sure you want to add this game for playing next?',
      header: isRemoving ? 'Remove from Play Next Confirmation' : 'Play Next Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.libraryService.togglePlayNext(game).subscribe({
          next: () => {
            this.messageService.add({
              severity: isRemoving ? 'warn' : 'success',
              summary: isRemoving ? 'Removed from Play Next' : 'Added to Play Next',
              detail: isRemoving ? 'Game removed from play next list' : 'Game added to play next list',
            });
          },
        });
      },
    });
  }

  removedFromPlayed(game: Game) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to mark this game as unplayed?',
      header: 'Unplayed Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.libraryService.setPlayed(game, false).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Back to Backlog',
              detail: `${game.name} moved back to your collection.`,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: 'Could not update the game status. Please try again.',
            });
          },
        });
      },
    });
  }

  displayDialog(game: Game) {
    this.selectedGame = game;
    this.displayCompletedDialog = true;
  }

  onGameCompleted(game: Game) {
    this.selectedGame = game;
  }

  trackGame(game: Game): string | number {
    return game._id ?? game.id;
  }

  confirmDelete(game: Game) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this game from your library?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.libraryService.removeFromLibrary(game._id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'warn', summary: 'Removed', detail: 'Game removed' });
          },
        });
      },
    });
  }
}

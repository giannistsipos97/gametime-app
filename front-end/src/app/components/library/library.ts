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
  playNextGames$ = this.libraryService.playNextGames$;

  ngOnInit(): void {
    this.libraryService.loadLibrary().subscribe();

    this.libraryService.loadLibrary();
  }

  isInPlayNext(gameId: number): boolean {
    return this.libraryService.isInPlayNext(gameId);
  }

  confirmPlayNext(game: Game) {
    if (this.isInPlayNext(game.id)) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to remove this game from your play next list?',
        header: 'Remove from Play Next Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.libraryService.togglePlayNext(game);
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
          this.libraryService.togglePlayNext(game);
          this.messageService.add({
            severity: 'success',
            summary: 'Added to Play Next',
            detail: 'Game added to play next list',
          });
        },
      });
    }
  }

  removedFromPlayed(game: Game) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to mark this game as unplayed?',
      header: 'Unplayed Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        // 1. Call the service and SUBSCRIBE
        this.libraryService.setPlayed(game, false).subscribe({
          next: () => {
            // 2. Success Feedback
            this.messageService.add({
              severity: 'warn',
              summary: 'Back to Backlog',
              detail: `${game.name} moved back to your collection.`,
            });

            // Note: game.played = false is no longer strictly needed
            // because the service refresh handles the UI, but it doesn't hurt.
          },
          error: (err) => {
            // 3. Handle potential server errors
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

  updateGame(game: Game) {
    // 1. Subscribe to the service call
    this.libraryService.setPlayed(game, true, game.platform).subscribe({
      next: () => {
        // 2. This only runs once MongoDB is updated and library is refreshed
        this.messageService.add({
          severity: 'success',
          summary: 'Marked as Played',
          detail: `Great job finishing ${game.name || 'the game'}!`,
        });

        // game.played = true;
        // ^ You can remove the line above because your libraryGames$
        // observable will push the updated game status automatically.
      },
      error: (err) => {
        // 3. Inform the user if the save failed
        this.messageService.add({
          severity: 'error',
          summary: 'Sync Failed',
          detail: 'Could not update status. Please check your connection.',
        });
      },
    });
  }

  confirmDelete(game: Game) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this game from your library?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        // Change 'game.id' to 'game._id'
        this.libraryService.removeFromLibrary(game._id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'warn', summary: 'Removed', detail: 'Game removed' });
          },
        });
      },
    });
  }
}

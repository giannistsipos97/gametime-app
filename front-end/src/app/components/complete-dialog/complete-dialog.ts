import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DialogHeaderComponent } from '../dialog-header/dialog-header';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { LibraryService } from '../../services/LibraryService.service';
import { Game } from '../../models/Game';
import { PLATFORMS } from '../../constants/platforms.const';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-complete-dialog',
  standalone: true,
  imports: [
    DialogModule,
    DialogHeaderComponent,
    ButtonModule,
    DatePickerModule,
    FormsModule,
    InputNumberModule,
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './complete-dialog.html',
  styleUrl: './complete-dialog.scss',
})
export class CompleteDialogComponent {
  private fb = inject(FormBuilder);
  private libraryService = inject(LibraryService);
  private messageService = inject(MessageService);
  platforms = PLATFORMS;

  gameForm!: FormGroup;

  @Input() title = '';
  @Input() selectedGame: Game | null = null;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateCurrentlyPlaying: EventEmitter<Game> = new EventEmitter<Game>();

  ngOnInit() {
    this.gameForm = this.fb.group({
      completionDate: [null, Validators.required],
      hoursPlayed: [null, [Validators.min(0)]],
      platform: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.gameForm.invalid || !this.selectedGame) {
      return;
    }

    const { completionDate, hoursPlayed, platform } = this.gameForm.value;

    const completedGame: Game = {
      ...this.selectedGame,
      played: true,
      platform,
      completedAt: new Date(completionDate).toISOString(),
      hoursPlayed,
    };

    this.libraryService
      .setPlayed(completedGame, true, platform, completedGame.completedAt, hoursPlayed)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Library Updated',
            detail: `${completedGame.name} marked as played!`,
          });

          this.updateCurrentlyPlaying.emit(completedGame);
          this.gameForm.reset();
          this.onClose();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Sync Failed',
            detail: 'Could not update the game. Please try again.',
          });
        },
      });
  }

  onClose() {
    this.closeDialog.emit(false);
  }
}

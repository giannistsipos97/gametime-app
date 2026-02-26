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

  visible: boolean = false;
  date: Date | null = null;
  hoursPlayed: number | null = null;
  gameForm!: FormGroup;

  @Input() title: string = '';
  @Input() selectedGame: Game | null = null;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateCurrentlyPlaying: EventEmitter<Game> = new EventEmitter<Game>();

  ngOnInit() {
    console.log(this.selectedGame);

    this.gameForm = this.fb.group({
      // Keep Validators.required here
      completionDate: [null, Validators.required],

      // Remove Validators.required here.
      // You can keep Validators.min(0) so if they DO type a number, it can't be negative.
      hoursPlayed: [null, [Validators.min(0)]],
      platform: [null, Validators.required],
    });
  }

  selectPlatform(event: any) {
    console.log(event.value);
  }

  onSubmit() {
    if (this.gameForm.invalid || !this.selectedGame) {
      return;
    }

    const { completionDate, hoursPlayed, platform } = this.gameForm.value;

    // 1. Capture a reference to the game for the success message/emit
    const savedGame = { ...this.selectedGame };

    // 2. Call the service and SUBSCRIBE
    this.libraryService
      .setPlayed(this.selectedGame, true, platform, new Date(completionDate).toISOString(), hoursPlayed)
      .subscribe({
        next: () => {
          // 3. This only runs on SUCCESS
          this.messageService.add({
            severity: 'success',
            summary: 'Library Updated',
            detail: `${savedGame.name} marked as played!`,
          });

          this.updateCurrentlyPlaying.emit(savedGame);
          this.gameForm.reset();
          this.onClose();
        },
        error: (err) => {
          // 4. Handle failure (the form stays open)
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

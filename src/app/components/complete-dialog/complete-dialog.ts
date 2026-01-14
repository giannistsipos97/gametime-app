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

    this.libraryService.setPlayed(
      this.selectedGame,
      true,
      platform,
      new Date(completionDate).toISOString(),
      hoursPlayed,
    );

    this.updateCurrentlyPlaying.emit(this.selectedGame);
    this.gameForm.reset();
    this.onClose();
  }

  onClose() {
    this.closeDialog.emit(false);
  }
}

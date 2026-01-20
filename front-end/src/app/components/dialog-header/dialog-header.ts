import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './dialog-header.html',
  styleUrl: './dialog-header.scss',
})
export class DialogHeaderComponent {
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-truncate-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './truncate-text.html',
})
export class TruncateTextComponent {
  @Input() text = '';
  @Input() limit = 120; // mobile limit
  expanded = false;

  toggle() {
    this.expanded = !this.expanded;
  }
}

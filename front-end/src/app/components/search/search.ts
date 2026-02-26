import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { GameService } from '../../services/GameService.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';
import { PlatformIconPipe } from '../../pipes/platform-icon.pipe';
import { Tooltip } from 'primeng/tooltip';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { LibraryService } from '../../services/LibraryService.service';
import { Game } from '../../models/Game';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    PopoverModule,
    PlatformIconPipe,
    Tooltip,
    RouterModule,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchComponent implements OnInit {
  private gameService = inject(GameService);
  private libraryService = inject(LibraryService);
  private messageService = inject(MessageService);

  private searchSubject = new Subject<string>();
  searchQuery: string = '';
  data: any;

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(500)) // 500ms delay after user stops typing
      .subscribe((query) => {
        if (query.trim()) {
          this.gameService.searchGames(query).subscribe((res) => {
            this.data = res.results;
          });
        } else {
          this.data = [];
        }
      });
  }

  onSearch() {
    // Emit the current searchQuery to the subject
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.data = [];
  }

  selectGame(game: any) {
    this.searchQuery = game.name;
    this.data = [];
  }

  addToLibrary(game: Game) {
    this.libraryService.addGame(game).subscribe({
      next: (updatedLibrary) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added to Library',
          detail: `${game.name} is now in your library!`,
        });
      },
    });
  }

  isInLibrary(id: number): boolean {
    // console.log('id => ', id);
    return this.libraryService.hasGame(id);
  }
}

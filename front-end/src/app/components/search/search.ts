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
  gameService = inject(GameService);
  libraryService = inject(LibraryService);
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
    this.libraryService.addGame(game);
    alert(`${game.name} added to your library!`);
  }

  isInLibrary(id: number): boolean {
    return this.libraryService.hasGame(id);
  }
}

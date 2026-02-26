import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { SearchComponent } from '../search/search';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { LibraryService } from '../../services/LibraryService.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MenubarModule,
    SearchComponent,
    TooltipModule,
    ButtonModule,
    PopoverModule,
    AsyncPipe,
    SplitButtonModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);
  libraryService = inject(LibraryService)

  title = 'Gametime';
  user$ = this.authService.currentUser$;

  userMenuItems: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.onLogout(),
    },
  ];

  onLogout() {
    this.libraryService.clear();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }

  toggleOverlay(searchQuery: string) {
    console.log('searchQuery => ', searchQuery);
  }
}

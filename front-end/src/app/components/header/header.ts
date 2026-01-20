import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { SearchComponent } from "../search/search";
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MenubarModule, SearchComponent, TooltipModule, ButtonModule, PopoverModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  title = 'Gametime';

  items = [
    { label: 'Librady', routerLink: '/library' },
  ]

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }

  toggleOverlay(searchQuery: string) {
    console.log("searchQuery => ", searchQuery);
  }

}

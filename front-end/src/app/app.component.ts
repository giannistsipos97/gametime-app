import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { Toast } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, Toast, ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `
    <div class="flex h-screen flex-col">
      <div class="fixed top-0 left-0 w-full z-50">
        <app-header />
      </div>

      <main class="flex-1 overflow-y-auto pt-28 sm:pt-32 md:pt-20">
        <router-outlet />
        <p-toast></p-toast>
      </main>

      <app-footer />
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'first-ng-app';
}

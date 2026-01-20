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
    <div class="flex flex-col h-screen">
      <!-- FIXED HEADER -->
      <div class="fixed top-0 left-0 w-full z-50">
        <app-header />
      </div>

      <!-- PAGE CONTENT (SCROLLABLE) -->
      <div class="flex-1 overflow-y-auto pt-16">
        <!-- pt-16 must match the header height -->
        <router-outlet />
        <p-toast></p-toast>
      </div>

      <app-footer />
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'first-ng-app';
}

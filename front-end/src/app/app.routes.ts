import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./components/search/search').then((m) => m.SearchComponent),
  },
  {
    path: 'gameDetails/:id',
    loadComponent: () => import('./components/game-details/game-details').then((m) => m.GameDetailsComponent),
  },
  { path: 'library', loadComponent: () => import('./components/library/library').then((m) => m.LibraryComponent) },
  { path: 'wishlist', loadComponent: () => import('./components/wishlist/wishlist').then((m) => m.WishlistComponent) },
  { path: 'stats', loadComponent: () => import('./components/stats/stats').then((m) => m.StatsComponent) },

  { path: 'register', loadComponent: () => import('./components/register/register').then((m) => m.RegisterComponent) },
];

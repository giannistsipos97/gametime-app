import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findStoreByUrl',
  standalone: true,
})
export class FindStoreByUrlPipe implements PipeTransform {
  transform(url: string): { name: string; icon: string } {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('playstation') || lowerUrl.includes('psn')) {
      return { name: 'PlayStation', icon: 'fa-brands fa-playstation' };
    }

    if (lowerUrl.includes('microsoft')) {
      return { name: 'Xbox', icon: 'fa-brands fa-xbox' };
    }

    if (lowerUrl.includes('nintendo')) {
      return { name: 'Nintendo', icon: 'fa-solid fa-n' };
    }

    if (lowerUrl.includes('epic')) {
      return { name: 'Epic Games', icon: 'fa-solid fa-store' };
    }

    if (lowerUrl.includes('steam')) {
      return { name: 'Steam', icon: 'fa-brands fa-steam' };
    }

    if (lowerUrl.includes('marketplace.xbox')) {
      return { name: 'Microsoft', icon: 'fa-brands fa-microsoft' };
    }

    if (lowerUrl.includes('gog')) {
      return { name: 'GOG', icon: 'fa-solid fa-circle' };
    }
    // fallback
    return { name: 'Store', icon: 'fa-solid fa-shop' };
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'platformIcon',
  standalone: true, // if using standalone components
})
export class PlatformIconPipe implements PipeTransform {
  transform(platformName: string | null | undefined): string {
    if (!platformName) return '';

    const name = platformName.toLowerCase();

    switch (name) {
      case 'pc':
        return 'fab fa-windows';
      case 'playstation':
        return 'fa-brands fa-playstation';
      case 'xbox':
        return 'fa-brands fa-xbox';
      case 'nintendo':
        return 'fa-solid fa-n';
      case 'apple macintosh':
        return 'fa-brands fa-apple';
      case 'linux':
        return 'fab fa-linux';
      case 'ios':
        return 'fa-brands fa-apple';
      case 'android':
        return 'fa-brands fa-android';
      default:
        return 'fa-solid fa-gamepad'; // fallback
    }
  }
}

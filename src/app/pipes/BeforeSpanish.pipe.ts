import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'beforeSpanish', standalone: true })
export class BeforeSpanishPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const index = value.indexOf('Español');
    return index >= 0 ? value.substring(0, index).trim() : value;
  }
}

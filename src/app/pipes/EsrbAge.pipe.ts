// src/app/pipes/esrb-age.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'esrbAge',
  standalone: true,
})
export class EsrbAgePipe implements PipeTransform {
  private ageMap: Record<string, number> = {
    Everyone: 0,
    'Everyone 10+': 10,
    Teen: 13,
    Mature: 17,
    'Adults Only': 18,
    'Rating Pending': 0,
  };

  transform(esrbName: string | undefined): number | null {
    if (!esrbName) {
      return null;
    }
    return this.ageMap[esrbName] ?? null;
  }
}

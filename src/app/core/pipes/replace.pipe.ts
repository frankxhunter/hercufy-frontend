import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
  standalone: true,
})
export class ReplacePipe implements PipeTransform {
  transform(value: string, params: Record<string, string>): string {
    if (!value) return '';
    let result = value;
    for (const [key, val] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
    }
    return result;
  }
}
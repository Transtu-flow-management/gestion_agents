import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], term: string, columns: string[]): any {
    if (!term || !columns || columns.length === 0) {
      return value;
    } else {
      term = term.toLowerCase();
      return value.filter(item =>
        columns.some(column =>
          this.isMatch(item[column], term)
        )
      );
    }
  }

  isMatch(value: any, term: string): boolean {
    if (typeof value === 'string') {
      return value.toLowerCase().includes(term);
    } else if (Array.isArray(value)) {
      return value.some(item => this.isMatch(item, term));
    } else if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(item => this.isMatch(item, term));
    }
    return false;
  }
}

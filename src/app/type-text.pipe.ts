import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeText'
})
export class TypeTextPipe implements PipeTransform {
  transform(value: number, incidentList: any[]): string {
    const typeObject = incidentList.find((item) => item.value === value);
    return typeObject ? typeObject.title : 'Unknown Type';
  }
}
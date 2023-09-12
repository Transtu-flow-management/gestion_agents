import {Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormControl, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  signs = [
    'Rat',
    'Ox',
    'Tiger',
    'Rabbit',
    'Dragon',
    'Snake',
    'Horse',
    'Goat',
    'Monkey',
    'Rooster',
    'Dog',
    'Pig',
  ];
  invalid: Observable<boolean>;

  constructor() {
    this.invalid = this.signCtrl.valueChanges.pipe(
      map(() => this.signCtrl.touched && !this.signCtrl.valid),
    );
  }

  signCtrl = new FormControl<string[]>([], Validators.required);

  getErrors() {
    const errors = [];
    if (this.signCtrl.hasError('required')) {
      errors.push('You must enter your zodiac sign');
    }
    if (this.signCtrl.hasError('cdkListboxUnexpectedMultipleValues')) {
      errors.push('You can only select one zodiac sign');
    }
    if (this.signCtrl.hasError('cdkListboxUnexpectedOptionValues')) {
      const invalidOptions = this.signCtrl.getError('cdkListboxUnexpectedOptionValues').values;
      errors.push(`You entered an invalid zodiac sign: ${invalidOptions[0]}`);
    }
    return errors.length ? errors : null;
  }
}

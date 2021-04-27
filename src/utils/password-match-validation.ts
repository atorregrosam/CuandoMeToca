import { AbstractControl } from '@angular/forms';
export class PasswordMatchValidation {

  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const rPassword = AC.get('rPassword').value; // to get value in input tag
    if (password !== rPassword) {
      AC.get('rPassword').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}

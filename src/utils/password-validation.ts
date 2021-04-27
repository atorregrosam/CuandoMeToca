import { FormControl } from '@angular/forms';

// tslint:disable-next-line:interface-name
export interface ValidationResult {
  [key: string]: boolean;
}

export class PasswordValidator {

  public static strong(control: FormControl): ValidationResult {
    const hasNumber = /\d/.test(control.value);
    const hasUpper = /[A-Z]/.test(control.value);
    const hasLower = /[a-z]/.test(control.value);
    const hasLength = control.value.length >= 8;
    const valid = hasNumber && hasLength && (hasUpper || hasLower);
    if (!valid) {
      // return what´s not valid
      return { strong: true };
    }
    return null;
  }
}


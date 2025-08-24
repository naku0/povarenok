import {Injectable} from "@angular/core";
import {FormControl, Validators} from '@angular/forms';

@Injectable({providedIn: "root"})
export class FormService {
  constructor() {}

  createEmailService(){
    return new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(35)
    ]);
  }

  createPasswordService() {
    return new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(6)
    ]);
  }

  getEmailErrors(email: FormControl): string {
    if (email.hasError('required'))  return ('Это поле обязательно!');
    else if (email.hasError('email')) return ('Не похоже на email');
    else if (email.hasError('maxlength')) return ('Слишком длинный email')
    else return ('');

  }

  getPasswordErrors(pswd: FormControl): string{
    if (pswd.hasError('required')) return("Это поле обязательно!");
    else if (pswd.hasError('minlength')) return("Ваш пароль слишком короткий! (6-30)");
    else if (pswd.hasError('maxlength')) return("Ваш пароль слишком длинный! (6-30)");
    else return('');
  }
}

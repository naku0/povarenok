import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../../core/services/(auth)/auth.service';
import {Router} from '@angular/router';
import {BaseFormComponent} from '../../components/base-form/base-form.component';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {merge} from 'rxjs';
import {MatError, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatFormField} from '@angular/material/form-field';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  standalone: true,
  templateUrl: 'register-page.component.html',
  styleUrl: 'register-page.component.scss',
  selector: 'register-page',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MatButton,
    MatIconModule,
    MatIconButton,
    MatSuffix,
    MatFabButton,
    MatTooltip,
  ],
})


export class RegisterPageComponent extends BaseFormComponent {
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  errorUsername = signal('');
  errorScndPswd = signal('');

  protected username = new FormControl('' , [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(15)
  ]);

  protected secondPswd = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30)
  ]);

  constructor() {
    super();

    this.secondPswd.addValidators(this.createPasswordMatchValidator());

    merge(this.secondPswd.valueChanges, this.secondPswd.statusChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateScndPswdError());

    merge(this.username.statusChanges, this.username.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateUsernameError());

    this.password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.secondPswd.updateValueAndValidity();
      });
  }

  private createPasswordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.password.value && control.value && this.password.value !== control.value) {
        return {mismatch: true};
      }
      return null;
    };
  }

  override isFormValid(): boolean {
    return this.username.valid &&
      this.secondPswd.valid &&
      super.isFormValid();
  }

  updateUsernameError(): void{
    if (this.username.hasError('required')) this.errorUsername.set('Это поле обязательно!')
    else if(this.username.hasError('minlength')) this.errorUsername.set('Слишком маленький юзернейм (4-10 символов)')
    else if(this.username.hasError('maxlength')) this.errorUsername.set('Слишком большой юзернейм (4-10 символов)')
    else this.errorUsername.set('');
  }

  updateScndPswdError() {
    if (this.secondPswd.hasError('required')) this.errorScndPswd.set('Это поле обязательно!');
    else if (this.secondPswd.hasError('minlength')) this.errorScndPswd.set('Ваш пароль слишком короткий! (6-30)"');
    else if (this.secondPswd.hasError('maxlength')) this.errorScndPswd.set('Ваш пароль слишком длинный! (6-30)');
    else if (this.secondPswd.hasError('mismatch')) this.errorScndPswd.set('Пароли не совпадают!');
    else this.errorScndPswd.set('');
  }

  onSubmit() {
    if (!this.isFormValid()) return;
    this.authService.register(this.email.value!, this.password.value!, this.username.value!)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: error => console.error('Registration error:', error)
      });
  }
}

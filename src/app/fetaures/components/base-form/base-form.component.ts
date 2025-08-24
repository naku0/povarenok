import {Component, inject, signal} from '@angular/core';
import {FormService} from '../../../core/services/(auth)/form.service';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  templateUrl: 'base-form.component.html',
  styleUrl: 'base-form.component.scss',
})

export abstract class BaseFormComponent {
  protected readonly formService = inject(FormService)

  email = this.formService.createEmailService();
  password = this.formService.createPasswordService();

  errorMail = signal('');
  errorPswd = signal('');

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor() {
    this.initListeners()
  }

  initListeners() {

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessage());

  }


  updateEmailErrorMessage() {
    this.errorMail.set(this.formService.getEmailErrors(this.email));
  }

  updatePasswordErrorMessage() {
    this.errorPswd.set(this.formService.getPasswordErrors(this.password));
  }

  protected isFormValid() {
    return this.email.valid && this.password.valid
  }

  abstract onSubmit(): void;

}

import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {AuthService} from '../../../core/services/(auth)/auth.service';
import {Router} from '@angular/router';
import {BaseFormComponent} from '../../components/base-form/base-form.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'login-page',
  standalone: true,
  templateUrl: "login-page.component.html",
  styleUrl: "login-page.component.scss",
  imports: [FormsModule, MatInputModule, ReactiveFormsModule, MatButton, MatIconButton, MatIconModule],
})

export class LoginPageComponent extends BaseFormComponent{
  private readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  onSubmit() {
    if(!this.isFormValid()) return;
    this.authService.login(this.email.value!, this.password.value!)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: error => console.log(error)
      })
  }

}

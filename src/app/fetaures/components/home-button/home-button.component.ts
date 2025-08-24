import {Component} from '@angular/core';
import {MatFabButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'home-button',
  standalone: true,
  templateUrl: 'home-button.component.html',
  imports: [
    MatFabButton,
    MatIconModule,
    MatTooltip,
    MatTooltip
  ],
  styleUrl: 'home-button.component.scss'
})
export class HomeButtonComponent {
  router = inject(Router);

  goHome() {
    this.router.navigate(['/'])
  }
}

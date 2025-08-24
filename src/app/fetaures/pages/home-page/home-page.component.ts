import {Component, OnInit} from '@angular/core';
import {Observable, switchMap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButton, MatFabButton} from '@angular/material/button';
import {Router} from '@angular/router';

import {AuthService} from '../../../core/services/(auth)/auth.service';
import {RecipeService} from '../../../core/services/(recipe)/recipe.service';
import {Recipe} from '../../../core/interfaces/recipe.interface';
import {MiniCardComponent} from '../../components/mini-card/mini-card.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'main-page',
  standalone: true,
  templateUrl: 'home-page.component.html',
  styleUrl: "home-page.component.scss",
  imports: [
    AsyncPipe,
    MatIconModule,
    MatButton,
    MatFabButton,
    MiniCardComponent,
    MatProgressSpinner,
  ],
})
export class HomePageComponent implements OnInit {
  recipes$?: Observable<Recipe[]>;

  constructor(
    public authService: AuthService, // изменил на public
    protected router: Router,
    protected recipeService: RecipeService
  ) {
  }

  ngOnInit() {
    this.loadRecipes();
  }

  goToMyProfile() {
    this.authService.getCurrentUserId().subscribe(
      uid => this.router.navigate(['/user', uid])
    )
  }

  loadRecipes(): void {
    this.recipes$ = this.recipeService.getRecipes();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}

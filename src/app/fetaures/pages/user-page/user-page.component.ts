import {Component, OnInit} from '@angular/core';
import {RecipeService} from '../../../core/services/(recipe)/recipe.service';
import {AuthService} from '../../../core/services/(auth)/auth.service';
import {finalize, map, Observable, of, switchMap} from 'rxjs';
import {Recipe} from '../../../core/interfaces/recipe.interface';
import {AsyncPipe} from '@angular/common';
import {MiniCardComponent} from '../../components/mini-card/mini-card.component';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDivider} from '@angular/material/divider';
import {User} from '@angular/fire/auth';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {UserProfile} from '../../../core/interfaces/user.interface';
import {HomeButtonComponent} from '../../components/home-button/home-button.component';

@Component({
  selector: 'user-page',
  standalone: true,
  styleUrl: 'user-page.component.scss',
  templateUrl: 'user-page.component.html',
  imports: [
    AsyncPipe,
    MiniCardComponent,
    MatIconModule,
    MatButton,
    MatProgressSpinner,
    MatDivider,
    MatCardContent,
    HomeButtonComponent,
  ]
})
export class UserPageComponent implements OnInit {
  userRecipes$!: Observable<Recipe[]>;
  userProfile$!: Observable<UserProfile | null>
  isOwnProfile = false;

  constructor(protected recipeService: RecipeService,
              protected authService: AuthService,
              protected router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.userProfile$ = this.authService.getUserProfile(userId);
        this.userRecipes$ = this.recipeService.getUserRecipes(userId);

      }
      this.authService.getCurrentUserId().subscribe(guestID => {
        this.isOwnProfile = userId === guestID;
      })
    });
  }
  createRecipe() {
    return this.router.navigate(['/newRecipe']);
  }
}

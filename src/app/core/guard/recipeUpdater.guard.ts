import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/(auth)/auth.service';
import {catchError, map, of, switchMap, take} from 'rxjs';
import {RecipeService} from '../services/(recipe)/recipe.service';

export const RecipeUpdaterGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const recipeService = inject(RecipeService);
  const recipeId = route.params['id'];

  return authService.getCurrentUser().pipe(
    take(1),
    switchMap(user => {
      if (!user) {
        router.navigate(['/login']);
        return of(false)
      }
      return recipeService.getRecipeById(recipeId).pipe(
        map(recipe => {
          if (!recipe) {
            router.navigate(['/404']);
            return false
          }

          if (recipe.authorId !== user.uid) {
            router.navigate(['/'])
            return false
          }
          return true
        })
      );
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false)
    })
  );
}

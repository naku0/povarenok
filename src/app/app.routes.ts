import {Routes} from '@angular/router';
import {LoginPageComponent} from './fetaures/pages/login-page/login-page.component';
import {HomePageComponent} from './fetaures/pages/home-page/home-page.component';
import {RegisterPageComponent} from './fetaures/pages/register-page/register-page.component';
import {NewRecipePageComponent} from './fetaures/pages/new-recipe-page/new-recipe-page.component';
import {UserPageComponent} from './fetaures/pages/user-page/user-page.component';
import {AuthGuard} from './core/guard/auth.guard';
import {RecipePageComponent} from './fetaures/pages/recipe-page/recipe-page.component';
import {UpdateRecipePageComponent} from './fetaures/pages/update-recipe-page/update-recipe-page.component';
import {RecipeUpdaterGuard} from './core/guard/recipeUpdater.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    pathMatch: "full",
  },
  {
    path:'login',
    component: LoginPageComponent,

  },
  {
    path:'register',
    component: RegisterPageComponent,
  },
  {
    path:'newRecipe',
    component: NewRecipePageComponent,
  },
  {
    path: 'user/:id',
    component: UserPageComponent
  },
  {
    path:'recipe/:id',
    component:RecipePageComponent,
  },
  {
    path:'updateRecipe/:id',
    component: UpdateRecipePageComponent,
    canActivate:[RecipeUpdaterGuard]
  }
];

import {Component} from '@angular/core';
import {RecipeFormComponent} from '../../components/recipe-form/recipe-form.component';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {Recipe} from '../../../core/interfaces/recipe.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipeService} from '../../../core/services/(recipe)/recipe.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  templateUrl: 'update-recipe-page.component.html',
  styleUrl: 'update-recipe-page.component.scss',
  imports: [
    RecipeFormComponent,
    AsyncPipe,
    MatProgressSpinner
  ]
})

export class UpdateRecipePageComponent {
  recipe$!: Observable<Recipe | null>
  recipeId: string;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {
    this.recipeId = this.route.snapshot.params['id'];
    if (this.recipeId)
      this.recipe$ = this.recipeService.getRecipeById(this.recipeId);
  }

  handleSubmit(event: { data: Omit<Recipe, 'id'>, isEdit: boolean, recipeId?: string }) {
    if (event.isEdit && event.recipeId) {
      this.recipeService.updateRecipe(event.recipeId, event.data).subscribe({
        next: () => this.router.navigate(['/recipe', event.recipeId]),
        error: err => console.log(err)
      })
    }

  }

  handleCancel() {
    this.router.navigate([`/recipe/${this.recipeId}`])
  }
}

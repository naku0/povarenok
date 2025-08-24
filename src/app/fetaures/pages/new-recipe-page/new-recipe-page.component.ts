import {Component} from '@angular/core';
import {RecipeFormComponent} from '../../components/recipe-form/recipe-form.component';
import {RecipeService} from '../../../core/services/(recipe)/recipe.service';
import {Recipe} from '../../../core/interfaces/recipe.interface';
import {Router} from '@angular/router';

@Component({
  selector: "new-recipe-page",
  standalone: true,
  templateUrl: 'new-recipe-page.component.html',
  imports: [
    RecipeFormComponent
  ],
  styleUrl: 'new-recipe-page.component.scss'
})
export class NewRecipePageComponent{
  constructor(private recipeService: RecipeService, private router: Router) {
  }
  handleSubmit(event: { data: Omit<Recipe, 'id'>, isEdit: boolean }) {
    if (!event.isEdit) {
      this.recipeService.addRecipe(event.data).subscribe({
        next: (recipeId) => this.router.navigate(['/recipe', recipeId]),
        error: (error) => console.error('Creation error:', error)
      });
    }
  }

  handleCancel() {
    this.router.navigate(['/']);
  }
}

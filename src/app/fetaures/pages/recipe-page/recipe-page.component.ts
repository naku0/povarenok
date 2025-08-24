import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipeService} from '../../../core/services/(recipe)/recipe.service';
import {Observable, of, switchMap} from 'rxjs';
import {MeasurementUnit, Recipe} from '../../../core/interfaces/recipe.interface';
import {AsyncPipe} from '@angular/common';
import {UnitService} from '../../../core/services/(recipe)/unit.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle, MatCardTitle
} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatButton} from '@angular/material/button';
import {HomeButtonComponent} from '../../components/home-button/home-button.component';
import {AuthService} from '../../../core/services/(auth)/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {DeleteDialogWindowComponent} from '../../components/delete-dialog-window/delete-dialog-window.component';

@Component({
  standalone: true,
  templateUrl: 'recipe-page.component.html',
  styleUrl: 'recipe-page.component.scss',
  selector: 'recipe-page',
  imports: [
    AsyncPipe,
    MatCard,
    MatCardHeader,
    MatIconModule,
    MatCardImage,
    MatProgressSpinner,
    MatCardActions,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatCardContent,
    MatButton,
    MatCardSubtitle,
    MatCardTitle,
    HomeButtonComponent
  ]
})
export class RecipePageComponent implements OnInit {
  recipe$!: Observable<Recipe | null>;
  flag$!: Observable<boolean>;
  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private unitService: UnitService,
              private router: Router,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');

      if (recipeId) {
        this.recipe$ = this.recipeService.getRecipeById(recipeId);
        this.flag$ = this.authService.getCurrentUserId().pipe(
          switchMap(uid =>{
            if(!uid) return of(false)
            else return this.recipeService.isOwnRecipe(recipeId, uid)
          })
        )

      }
    });
  }

  goToChange(recipeId: string) {
    this.router.navigate(['/updateRecipe', recipeId]);
  }

  openDialog(recipeId: string){
    const dialogRef = this.dialog.open(DeleteDialogWindowComponent);
    dialogRef.afterClosed().subscribe(res =>{
      if (res){
        this.delete(recipeId);
        this.router.navigate(['/'])
      }
    })
  }

  private delete(recipeId: string){
    this.recipeService.deleteRecipe(recipeId);
  }

  chandeMeasurements(preferable: MeasurementUnit) {
    //this.unitService.
  }


}

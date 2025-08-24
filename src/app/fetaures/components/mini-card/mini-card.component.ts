import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../../../core/interfaces/recipe.interface';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader, MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {Observable, of, switchMap} from 'rxjs';
import {RecipeService} from '../../../core/services/(recipe)/recipe.service';
import {AuthService} from '../../../core/services/(auth)/auth.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {DeleteDialogWindowComponent} from '../delete-dialog-window/delete-dialog-window.component';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '../../../core/pipe/date.pipe'

@Component({
  standalone: true,
  templateUrl: 'mini-card.component.html',
  styleUrl: 'mini-card.component.scss',
  selector: 'mini-card',
  imports: [
    MatIconModule,
    MatCardActions,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatButton,
    MatIconButton,
    MatCardImage,
    RouterLink,
    AsyncPipe,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    DatePipe,
  ]
})
export class MiniCardComponent implements OnInit{
  flag$!: Observable<boolean>
  @Input() recipeData!: Recipe

  constructor(protected router: Router,
              private recipeService: RecipeService,
              private authService: AuthService,
              private dialog: MatDialog) {

  }

  ngOnInit() {
    this.flag$ = this.authService.getCurrentUserId().pipe(
      switchMap(uid => {
        if (!uid) return of(false);
        else {
          return this.recipeService.isOwnRecipe(this.recipeData.id, uid)
        }
      })
    );
  }

  handleChange(){
    this.router.navigate(['/updateRecipe', this.recipeData.id])
  }

  handleDelete(){
    const dialogRef = this.dialog.open(DeleteDialogWindowComponent);
    dialogRef.afterClosed().subscribe(res =>{
      if (res){
        this.delete(this.recipeData.id);
        this.router.navigate(['/'])
      }
    })
  }

  private delete(recipeId: string){
    this.recipeService.deleteRecipe(recipeId);
  }

}

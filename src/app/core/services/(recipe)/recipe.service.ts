import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
   docData, query, where, orderBy, deleteDoc, updateDoc
} from '@angular/fire/firestore';
import {catchError, from, map, Observable, of, pipe, throwError} from 'rxjs';
import {Recipe} from '../../interfaces/recipe.interface';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class RecipeService {
  firestore = inject(Firestore);

  constructor(private router: Router) {
  }

  private get recipesCollection() {
    return collection(this.firestore, 'recipes');
  }

  getRecipes(): Observable<Recipe[]> {
    return collectionData(this.recipesCollection, {
      idField: 'id'
    }) as Observable<Recipe[]>
  }

  getUserRecipes(userId: string) {
    const q = query(
      this.recipesCollection, where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, {
      idField: 'id'
    }) as Observable<Recipe[]>
  }


  addRecipe(recipe: Omit<Recipe, 'id'>): Observable<string> {
    return from(addDoc(this.recipesCollection, recipe)).pipe(
      map(docRef => docRef.id),
      catchError(err => {
        return throwError(() => err)
      })
    );
  }

  updateRecipe(id: string, recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Observable<void> {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    const updatedRecipe = {
      ...recipe,
      updatedAt: new Date(),
    }
    return from(updateDoc(recipeDoc,updatedRecipe)).pipe(
      catchError(error => {
        console.log(error)
        throw new Error(error)
      })
    )
  }

  deleteRecipe(id: string):Observable<void>{
      const recipeDoc = doc(this.firestore, `recipes/${id}`);
      return from(deleteDoc(recipeDoc));
  }

  getRecipeById(id: string): Observable<Recipe | null> {
    const docRef = doc(this.firestore, `recipes/${id}`);
    return docData(docRef, {idField: 'id'}).pipe(
      map(recipe => {
        if (!recipe) {
          this.router.navigate(['/404'])
        }
        return recipe as Recipe;
      }),
      catchError(error => {
        console.error('Error getting recipe:', error);
        return throwError(() => error);
      })
    );
  }

  isOwnRecipe(recipeId: string, uid:string){
    return this.getRecipeById(recipeId).pipe(
      map(recipe => recipe?.authorId === uid),
      catchError(() => of(false))
    );
  }


}

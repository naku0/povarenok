import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule} from '@angular/forms';
import {CookingStep, Ingredient, MeasurementUnit, Recipe} from '../../../core/interfaces/recipe.interface';
import {MatFormField} from '@angular/material/form-field';
import {MatError, MatInput, MatLabel} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/services/(auth)/auth.service';
import {Observable, of, switchMap, take, throwError} from 'rxjs';
import {RecipeService} from '../../../core/services/(recipe)/recipe.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {User} from '@angular/fire/auth';
import {AsyncPipe} from '@angular/common';

@Component({
  standalone: true,
  selector: 'recipe-form',
  templateUrl: 'recipe-form.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatSelect,
    MatOption,
    MatInput,
    MatIconButton,
    MatButton,
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    MatFabButton,
    MatIconModule,
    MatCard,
    MatCardContent,
    AsyncPipe,
  ],
  styleUrl: 'recipe-form.component.scss'
})
export class RecipeFormComponent implements OnInit {

  @Input() recipe?: Recipe;
  @Output() formSubmitted = new EventEmitter<{
    data: Omit<Recipe, 'id'>,
    isEdit: boolean,
    recipeId?: string
  }>();
  @Output() cancelled = new EventEmitter<void>();
  isEditMode!: boolean;

  user$!: Observable<User | null>;

  recipeForm: FormGroup;
  measurementUnits: MeasurementUnit[] = [
    'г', 'кг', 'мг', 'унция', 'фунт', 'мл', 'л',
    'ч.л.', 'ст.л.', 'стакан', 'шт', 'ломтик',
    'зубчик', 'пучок', 'банка', 'упаковка',
    'щепотка', 'капля', 'по вкусу'
  ];

  fileToUpload: any;
  imageUrl: any;
  picError = '';
  hasPicError = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private recipeService: RecipeService) {
    this.recipeForm = this.createForm();
    this.user$ = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.recipe;

    if (this.recipe) {
      this.fillForm()
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      cuisine: [''],
      tags: [''],
      imageUrl: [''],
      prepTime: [0, [Validators.required, Validators.min(0)]],
      cookTime: [0, [Validators.required, Validators.min(0)]],
      servings: [1, [Validators.required, Validators.min(1)]],
      difficulty: ['легко', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
      steps: this.fb.array([this.createStep()])
    })
  }


  navigateToLogin() {
    return this.router.navigate(['/login']);
  }

  hasError(controlName: string): boolean {
    const control = this.recipeForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getError(controlName: string): string {
    const control = this.recipeForm.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Это поле обязательно';
    if (errors['min']) return `Минимальное значение: ${errors['min'].min}`;
    if (errors['max']) return `Максимальное значение: ${errors['max'].max}`;
    if (errors['invalidFileType']) return 'Неверный тип файла. Разрешены только изображения';
    if (errors['fileTooLarge']) return 'Файл слишком большой. Максимальный размер: 5MB';

    return 'Неверное значение';
  }

  hasIngredientError(index: number, controlName: string): boolean {
    const ingredient = this.ingredients.at(index);
    const control = ingredient.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getIngredientError(index: number, controlName: string): string {
    const ingredient = this.ingredients.at(index);
    const control = ingredient.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Это поле обязательно';
    if (errors['min']) return `Минимальное значение: ${errors['min'].min}`;

    return 'Неверное значение';
  }

  hasStepError(index: number, controlName: string): boolean {
    const step = this.steps.at(index);
    const control = step.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getStepError(index: number, controlName: string): string {
    const step = this.steps.at(index);
    const control = step.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Это поле обязательно';
    if (errors['min']) return `Минимальное значение: ${errors['min'].min}`;

    return 'Неверное значение';
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      amount: [1, [Validators.required, Validators.min(0)]],
      unit: ['г', Validators.required],
      name: ['', Validators.required],
      notes: ['']
    });
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  createStep(): FormGroup {
    return this.fb.group({
      instruction: ['', Validators.required],
      duration: [0, [Validators.min(0)]],
      tips: ['']
    });
  }

  addStep(): void {
    this.steps.push(this.createStep());
  }

  removeStep(index: number): void {
    if (this.steps.length > 1) {
      this.steps.removeAt(index);
    }
  }

  handlePicChange(file: FileList | null) {
    this.hasPicError = false;
    if (!file || file.length === 0) return;

    this.fileToUpload = file.item(0);

    if (!this.fileToUpload?.type.startsWith('image/')) {
      this.hasPicError = true;
      this.picError = 'Неверный тип файла. Разрешены только изображения';
      ;
      this.removePic();
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (this.fileToUpload.size > maxSize) {
      this.hasPicError = true;
      this.picError = 'Файл слишком большой. Максимальный размер: 5MB';
      this.removePic();
      return;
    }

    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload)
  }

  removePic() {
    this.fileToUpload = null;
    this.imageUrl = null;
    this.recipeForm.get('pic')?.reset();
  }

  onSubmit(): void {
    this.markAllAsTouched();
    if (this.recipeForm.valid) {
      this.authService.currentUser$.pipe(
        take(1),
        switchMap(currentUser => {
          if (!currentUser) {
            return throwError(() => new Error('User not authenticated'));
          }
          const formData: Omit<Recipe, 'id'> = this.prepareForm(currentUser);
          console.log(formData);
          this.formSubmitted.emit({
            data: formData,
            isEdit: this.isEditMode,
            recipeId: this.recipe?.id
          });
          return of(null);
        })
      ).subscribe({
        next: (recipeId) => {
          this.router.navigate(['/recipes', recipeId]);
        },
        error: error => console.log(error)
      });
    }
  }

  private markAllAsTouched(): void {
    Object.keys(this.recipeForm.controls).forEach(key => {
      const control = this.recipeForm.get(key);
      if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            Object.keys(group.controls).forEach(subKey => {
              group.get(subKey)?.markAsTouched();
            });
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  private prepareForm(currentUser: User): Omit<Recipe, 'id'> {
    return {
      name: this.recipeForm.value.name,
      description: this.recipeForm.value.description || '',

      authorId: currentUser.uid,
      authorName: currentUser.displayName || currentUser.email || 'Анонимный пользователь',

      ingredients: this.prepareIngredients(),
      steps: this.prepareSteps(),

      cuisine: this.recipeForm.value.cuisine || '',
      category: this.recipeForm.value.category,
      tags: this.recipeForm.value.tags ?
        this.recipeForm.value.tags.split(',').map((tag: string) => tag.trim()) : [],

      prepTime: Number(this.recipeForm.value.prepTime),
      cookTime: Number(this.recipeForm.value.cookTime),
      totalTime: Number(this.recipeForm.value.prepTime) + Number(this.recipeForm.value.cookTime),

      servings: Number(this.recipeForm.value.servings),

      imageUrl: this.imageUrl,

      difficulty: this.recipeForm.value.difficulty,

      createdAt: this.recipe?.createdAt || new Date(),
      updatedAt: new Date()
    };
  }

  private prepareIngredients(): Ingredient[] {
    return this.recipeForm.value.ingredients.map((ingredient: any, index: number) => ({
      id: index + 1,
      name: ingredient.name,
      amount: Number(ingredient.amount),
      unit: ingredient.unit as MeasurementUnit
    }));
  }

  private prepareSteps(): CookingStep[] {
    return this.recipeForm.value.steps.map((step: any, index: number) => ({
      stepNumber: index + 1,
      instruction: step.instruction,
      duration: step.duration ? Number(step.duration) : 0,
    }));
  }

  onCancel(): void {
    this.cancelled.emit();
  }


  private fillForm(): void {
    this.recipeForm.patchValue({
      name: this.recipe!.name,
      description: this.recipe!.description,
      category: this.recipe!.category,
      cuisine: this.recipe!.cuisine || '',
      tags: this.recipe!.tags.join(', '),
      imageUrl: this.recipe!.imageUrl || '',
      prepTime: this.recipe!.prepTime,
      cookTime: this.recipe!.cookTime,
      servings: this.recipe!.servings,
      difficulty: this.recipe!.difficulty
    });

    this.ingredients.clear();
    this.recipe!.ingredients.forEach(ingredient => {
      this.ingredients.push(this.fb.group({
        amount: [ingredient.amount, [Validators.required, Validators.min(0)]],
        unit: [ingredient.unit, Validators.required],
        name: [ingredient.name, Validators.required],
      }));
    });

    this.steps.clear();
    this.recipe!.steps.forEach(step => {
      this.steps.push(this.fb.group({
        instruction: [step.instruction, Validators.required],
        duration: [step.duration || 0, [Validators.min(0)]],
      }));
    });

    if (this.recipe!.imageUrl) {
      this.imageUrl = this.recipe!.imageUrl;
    }
  }

  protected readonly document = document;

}

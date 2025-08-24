export interface Recipe {
  id: string;
  name: string;
  description: string;

  authorId: string;
  authorName: string;

  ingredients: Ingredient[];
  steps: CookingStep[];

  cuisine?: string;
  category: string;
  tags: string[];

  prepTime: number;
  cookTime: number;
  totalTime: number;

  servings: number;

  imageUrl?: string;

  createdAt: Date;
  updatedAt: Date;
  difficulty: 'легко' | 'средне' | 'сложно';
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: MeasurementUnit;
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  duration?: number;
}

export type MeasurementUnit =
  | 'г' | 'кг' | 'мг'
  | 'унция' | 'фунт'

  | 'мл' | 'л'
  | 'ч.л.' | 'ст.л.' | 'стакан' | 'пинта' | 'кварта' | 'галлон'

  | 'шт' | 'ломтик' | 'зубчик' | 'пучок'
  | 'банка' | 'упаковка'

  | 'щепотка' | 'капля' | 'по вкусу';

export const WEIGHT_UNITS: MeasurementUnit[] = ['г', 'кг', 'мг', 'унция', 'фунт'];
export const VOLUME_UNITS: MeasurementUnit[] = ['мл', 'л', 'ч.л.', 'ст.л.', 'стакан', 'пинта', 'кварта', 'галлон'];
export const PIECE_UNITS: MeasurementUnit[] = ['шт', 'ломтик', 'зубчик', 'пучок', 'банка', 'упаковка'];
export const OTHER_UNITS: MeasurementUnit[] = ['щепотка', 'капля', 'по вкусу'];

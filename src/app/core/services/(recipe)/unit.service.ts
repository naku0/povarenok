import {Injectable} from "@angular/core";
import {MeasurementUnit} from "../../interfaces/recipe.interface";

@Injectable({providedIn: "root"})

export class UnitService {
  constructor() {
  }

  getUnitDisplayName(unit: MeasurementUnit) {
    const unitNames: { [key in MeasurementUnit]: string } = {
      "г": "грамм",
      "кг": "килограмм",
      "мг": "миллиграмм",
      "унция": "унция",
      "фунт": "фунт",
      "мл": "миллилитр",
      "л": "литр",
      "ч.л.": "чайная ложка",
      "ст.л.": "столовая ложка",
      "стакан": "стакан",
      "пинта": "пинта",
      "кварта": "кварта",
      "галлон": "галлон",
      "шт": "штука",
      "ломтик": "ломтик",
      "зубчик": "зубчик",
      "пучок": "пучок",
      "банка": "банка",
      "упаковка": "упаковка",
      "щепотка": "щепотка",
      "капля": "капля",
      "по вкусу": "по вкусу"
    };
    return unitNames[unit];
  }

  getPluralForm(amount: number, unit: MeasurementUnit): string {
    if (unit === 'по вкусу') return unit

    const lastDigit = amount % 10;
    const lastTwoigits = amount % 100;

    const forms: { [key in MeasurementUnit]?: [string, string, string] } = {
      'г': ['грамм', 'грамма', 'граммов'],
      'кг': ['килограмм', 'килограмма', 'килограммов'],
      'мл': ['миллилитр', 'миллилитра', 'миллилитров'],
      'л': ['литр', 'литра', 'литров'],
      'ч.л.': ['чайная ложка', 'чайные ложки', 'чайных ложек'],
      'ст.л.': ['столовая ложка', 'столовые ложки', 'столовых ложек'],
      'шт': ['штука', 'штуки', 'штук'],
      'ломтик': ['ломтик', 'ломтика', 'ломтиков'],
      'зубчик': ['зубчик', 'зубчика', 'зубчиков'],
      'щепотка': ['щепотка', 'щепотки', 'щепоток'],
      'банка': ['банка', "банки", "банок"],
      "капля": ["капля", "капли", "капель"],
    };

    if (!forms[unit]) return this.getUnitDisplayName(unit);

    let formIndex: number;

    if (lastTwoigits >= 11 && lastTwoigits <= 19) {
      formIndex = 2;
    } else if (lastDigit === 1) {
      formIndex = 0;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      formIndex = 1;
    } else {
      formIndex = 2;
    }

    return forms[unit]![formIndex];
  }

}

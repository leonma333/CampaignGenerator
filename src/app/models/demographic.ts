import { Model } from './model';
import { COUNTRIES } from '../constants';

enum Gender {
  neutral = 'neutral',
  male = 'male',
  female = 'female'
}

export const DEFAULT_COUNTRIES = ['CA', 'US', 'JP', 'GB', 'DE', 'CN', 'TW', 'HK'];

export class Demographic extends Model {
  public gender: Gender;
  public minAge: number;
  public maxAge: number;
  public countries: Array<string>;

  static default(): object {
    const demographic = new Demographic(Gender.neutral, 0, 100, DEFAULT_COUNTRIES);
    return demographic.value();
  }

  constructor(gender: string, minAge: number, maxAge: number, countries: Array<string>) {
    super();
    this.gender = Gender[gender];
    this.minAge = minAge;
    this.maxAge = maxAge;
    this.countries = countries;
  }

  value(): object {
    return {
      gender: this.gender,
      minAge: this.minAge,
      maxAge: this.maxAge,
      countries: this.countries
    };
  }

  from(value: any): void {
    this.gender = value.gender;
    this.minAge = value.minAge;
    this.maxAge = value.maxAge;
    this.countries = value.countries;
  }

  format(): string {
    let gender = this.gender as string;
    if (gender === 'neutral') {
      gender = 'all genders';
    }

    let age = `from age ${this.minAge} to ${this.maxAge}`;
    if (this.minAge === this.maxAge) {
      age = `at age ${this.minAge}`;
    }

    let countries = `in countries: ${this.countries.map(country => COUNTRIES[country]).join(', ')}`;
    if (this.countries.length === Object.keys(COUNTRIES).length) {
      countries = 'in all countries';
    }

    return `Targeting ${gender} ${age} ${countries}`;
  }

  setGender(gender: string) {
    this.gender = Gender[gender];
  }
}

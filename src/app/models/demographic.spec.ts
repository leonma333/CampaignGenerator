import { COUNTRIES } from '../constants';
import { Demographic, DEFAULT_COUNTRIES } from '../models/demographic';

describe('Model: Demographic', () => {
  it('#default', () => {
    expect(Demographic.default()).toEqual({
      gender: 'neutral',
      minAge: 0,
      maxAge: 100,
      countries: DEFAULT_COUNTRIES
    });
  });

  it('onetime', () => {
    const demographic = new Demographic('male', 20, 80, ['CA', 'US', 'JP']);
    expect(demographic.value()).toEqual({
      gender: 'male',
      minAge: 20,
      maxAge: 80,
      countries: ['CA', 'US', 'JP']
    });
  });

  it('#from', () => {
    const demographic = new Demographic(null, null, null, null);
    demographic.from({
      gender: 'male',
      minAge: 5,
      maxAge: 18,
      countries: ['CN', 'TW', 'HK']
    });

    expect(demographic.gender).toBe('male');
    expect(demographic.minAge).toBe(5);
    expect(demographic.maxAge).toBe(18),
    expect(demographic.countries).toEqual(['CN', 'TW', 'HK']);
  });

  it('#setGender', () => {
    const demographic = new Demographic(null, null, null, null);
    demographic.setGender('male');
    expect(demographic.gender).toBe('male');
    demographic.setGender('female');
    expect(demographic.gender).toBe('female');
    demographic.setGender('neutral');
    expect(demographic.gender).toBe('neutral');
  });

  describe('#format', () => {
    let demographic: Demographic;

    beforeEach(() => {
      demographic = new Demographic(null, null, null, null);
    });

    it('one gender, different age', () => {
      demographic.from({
        gender: 'male',
        minAge: 18,
        maxAge: 30,
        countries: ['FR', 'DE', 'ES']
      });
      expect(demographic.format()).toBe('Targeting male from age 18 to 30 in countries: France, Germany, Spain');
    });

    it('one gender, different age', () => {
      demographic.from({
        gender: 'male',
        minAge: 18,
        maxAge: 30,
        countries: Object.keys(COUNTRIES)
      });
      expect(demographic.format()).toBe('Targeting male from age 18 to 30 in all countries');
    });

    it('all gender, different age', () => {
      demographic.from({
        gender: 'neutral',
        minAge: 18,
        maxAge: 30,
        countries: ['FR', 'DE', 'ES']
      });
      expect(demographic.format()).toBe('Targeting all genders from age 18 to 30 in countries: France, Germany, Spain');
    });

    it('all gender, different age, all countries', () => {
      demographic.from({
        gender: 'neutral',
        minAge: 18,
        maxAge: 30,
        countries: Object.keys(COUNTRIES)
      });
      expect(demographic.format()).toBe('Targeting all genders from age 18 to 30 in all countries');
    });

    it('all gender, same age', () => {
      demographic.from({
        gender: 'neutral',
        minAge: 18,
        maxAge: 18,
        countries: ['FR', 'DE', 'ES']
      });
      expect(demographic.format()).toBe('Targeting all genders at age 18 in countries: France, Germany, Spain');
    });

    it('all gender, same age, all countries', () => {
      demographic.from({
        gender: 'neutral',
        minAge: 18,
        maxAge: 18,
        countries: Object.keys(COUNTRIES)
      });
      expect(demographic.format()).toBe('Targeting all genders at age 18 in all countries');
    });
  });
});

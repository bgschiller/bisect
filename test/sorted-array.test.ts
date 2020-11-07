import * as fc from 'fast-check';
import SortedArray, { Comparable } from '../src';

interface Pet {
  name: string;
  dateOfBirth: Date;
  numberLegs: number;
}

const pets: Pet[] = [
  { name: 'Heidi', dateOfBirth: new Date(2007, 10, 1), numberLegs: 4 },
  { name: 'Artemis', dateOfBirth: new Date(2014, 3, 1), numberLegs: 4 },
  { name: 'Some-Snake', dateOfBirth: new Date(2015, 3, 5), numberLegs: 0 },
  { name: 'Sully', dateOfBirth: new Date(2005, 1, 1), numberLegs: 3 },
];

function isSorted<T, C extends Comparable>(sa: SortedArray<T, C>): boolean {
  if (sa.length <= 1) return true;
  let prevKey = sa.key(sa.array[0]);
  for (const el of sa.array) {
    const currKey = sa.key(el);
    if (currKey > prevKey) return false;
    prevKey = currKey;
  }
  return true;
}

const ArbitraryPet: fc.Arbitrary<Pet> = fc.record({
  name: fc.string(),
  dateOfBirth: fc.date(),
  numberLegs: fc.nat(),
});

describe('SortedArray', () => {
  const sa = new SortedArray(p => p.name, pets);
  it('sorts the initially passed array', () => {
    expect(sa.array[0].name).toBe('Artemis');
  });
  it('avoids mutating the argument', () => {
    expect(pets[0].name).toBe('Heidi');
  });

  it('is an error to change the array', () => {
    const sa = new SortedArray<number, number>(x => x);
    // @ts-expect-error
    sa.array.push(4);
  });
  it('maintains sorted order, under inserts', () =>
    fc.assert(
      fc.property(
        fc.constantFrom(
          (p: Pet) => p.name,
          (p: Pet) => p.dateOfBirth,
          (p: Pet) => p.numberLegs
        ),
        fc.array(ArbitraryPet),
        (key, pets) => {
          const sa = new SortedArray<Pet, Comparable>(key);
          for (const pet of pets) {
            sa.insert(pet);
          }
          return isSorted(sa);
        }
      )
    ));
});

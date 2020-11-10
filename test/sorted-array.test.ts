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
    if (prevKey > currKey) return false;
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
    expect(isSorted(sa)).toBe(true);
  });
  it('avoids mutating the argument', () => {
    expect(pets[0].name).toBe('Heidi');
  });

  it('is an error to change the array', () => {
    const sa = new SortedArray<number, number>(x => x);
    // @ts-expect-error
    sa.array.push(4);
  });
  it('is allowed to copy the array', () => {
    const sa = new SortedArray<number, number>(x => x);
    sa.array.slice().push(3);
  });
  const ArbitraryKey = fc.constantFrom(
    (p: Pet) => p.numberLegs,
    (p: Pet) => p.name,
    (p: Pet) => p.dateOfBirth
  );
  it('maintains sorted order, under inserts', () =>
    fc.assert(
      fc.property(ArbitraryKey, fc.array(ArbitraryPet), (key, pets) => {
        const sa = new SortedArray<Pet, Comparable>(key);
        for (const pet of pets) {
          sa.insert(pet);
        }
        return isSorted(sa);
      })
    ));

  const rangeQueryArgs = fc
    .record({
      key: ArbitraryKey,
      pets: fc.array(ArbitraryPet),
      start: ArbitraryPet,
      end: ArbitraryPet,
    })
    .map(({ start, end, pets, key }) => ({
      key,
      pets,
      start: key(start),
      end: key(end),
    }));

  it('returns correct elements for range query', () =>
    fc.assert(
      fc.property(rangeQueryArgs, ({ key, pets, start, end }) => {
        const sa = new SortedArray<Pet, Comparable>(key, pets);
        const [startIx, endIx] = sa.rangeInclusive(start, end);
        for (const [ix, elem] of sa.array.entries()) {
          const ixInRange = ix >= startIx && ix < endIx;
          const valInRange = key(elem) >= start && key(elem) <= end;
          expect(ixInRange).toBe(valInRange);
        }
      })
    ));

  it('removes all elements in range', () =>
    fc.assert(
      fc.property(rangeQueryArgs, ({ key, pets, start, end }) => {
        const sa = new SortedArray<Pet, Comparable>(key, pets);
        const removedPets = sa.removeRange(...sa.rangeInclusive(start, end));
        for (const removed of removedPets) {
          const kRemoved = sa.key(removed);
          expect(kRemoved >= start && kRemoved <= end).toBe(true);
        }
        for (const elem of sa.array) {
          const kElem = sa.key(elem);
          expect(kElem < start || kElem >= end).toBe(true);
        }
      })
    ));
});

# @bgschiller/bisect

A reimplementation of Python's bisect library in TypeScript.

## API

### bisect_left

Locate the insertion point for `needle` in `arr` to maintain sorted order. The parameters `lo` and `hi` may be used to specify a subset of the list which should be considered; by default the entire list is used. If `needle` is already present in `arr`, the insertion point will be before (to the left of) any existing entries. The return value is suitable for use as the first parameter to `Array.prototype.splice()` assuming that `arr` is already sorted.

```ts
function bisect_left<C extends Comparable>(
  arr: C[],
  needle: C,
  lo: number = 0,
  hi: number = arr.length
): number;
```

The returned insertion point `i` partitions the array `arr` into two halves so that `arr.slice(lo, i).every(val => val < needle)` for the left side and `arr.slice(i, hi).every(val => val >= x)` for the right side.

### bisect_right

Similar to `bisect_left()`, but returns an insertion point which comes after (to the right of) any existing entries of `needle` in `arr`.

```ts
function bisect_right<C extends Comparable>(
  arr: C[],
  needle: C,
  lo: number = 0,
  hi: number = arr.length
): number;
```

The returned insertion point `i` partitions the array `arr` into two halves so that `arr.slice(lo, i).every(val => val <= x)` for the left side and `arr.slice(i, hi).every(val => val > x)` for the right side.

### SortedArray

In order to work with more complex types than `string | number | Date`, it is useful to have a container that applies a key function and maintains sorted order for you.

Check out the source to see what methods exist (it's not too hard to read).

```ts
const pets: Pet[] = [
  { name: 'Heidi', dateOfBirth: new Date(2007, 10, 1), numberLegs: 4 },
  { name: 'Artemis', dateOfBirth: new Date(2014, 3, 1), numberLegs: 4 },
  { name: 'Some-Snake', dateOfBirth: new Date(2015, 3, 5), numberLegs: 0 },
  { name: 'Sully', dateOfBirth: new Date(2005, 1, 1), numberLegs: 3 },
];

const sa = new SortedArray(p => p.name, pets);

function petsAreEqual(p1: Pet, p2: Pet): boolean {
  return p1.name === p2.name;
}

sa.contains(
  { name: 'Heidi', dateOfBirth: new Date(2007, 10, 1), numberLegs: 4 },
  petsAreEqual //(uses object equality if no second param is passed)
); // true
sa.insert({
  name: 'Colt',
  dateOfBirth: new Date(2010, 3, 1),
  numberOfLegs: 4,
}); // false

for (const pet of sa) {
  console.log(pet);
}
```

export type Comparable = string | number | Date;
export type KeyFunc<T, C extends Comparable> = (arg0: T) => C;
export type Comparator<T> = (a: T, b: T) => -1 | 0 | 1;

function mkComparator<T, C extends Comparable>(ks: KeyFunc<T, C>) {
  return function cmp(a: T, b: T): -1 | 0 | 1 {
    const ka = ks(a);
    const kb = ks(b);
    if (ka > kb) return 1;
    if (ka < kb) return -1;
    return 0;
  };
}

export class BisectError extends Error {}

// find the insertion point for `needle` in `arr` to maintain
// sorted order. if `needle` already appears in `arr`, the
// insertion point will be to the left of any existing entries.
export function bisect_left<C extends Comparable>(
  arr: C[],
  needle: C,
  lo: number = 0,
  hi: number = arr.length
): number {
  if (lo < 0)
    throw new BisectError(`low parameter must be >= 0, received ${lo}`);
  let lowIx = lo;
  let highIx = hi;
  let midIx;

  while (lowIx < highIx) {
    // The naive `low + high >>> 1` could fail for large arrays
    // because `>>>` converts its operands to int32 and (low + high) could
    // be larger than 2**31
    midIx = lowIx + ((highIx - lowIx) >>> 1);
    const mKey = arr[midIx];
    if (mKey < needle) {
      lowIx = midIx + 1;
    } else {
      highIx = midIx;
    }
  }
  return lowIx;
}

export function bisect_right<C extends Comparable>(
  arr: C[],
  needle: C,
  lo: number = 0,
  hi: number = arr.length
): number {
  if (lo < 0)
    throw new BisectError(`low parameter must be >= 0, received ${lo}`);

  let lowIx = lo;
  let highIx = hi;
  let midIx;

  while (lowIx < highIx) {
    // The naive `low + high >>> 1` could fail for large arrays
    // because `>>>` converts its operands to int32 and (low + high) could
    // be larger than 2**31
    midIx = lowIx + ((highIx - lowIx) >>> 1);
    const mKey = arr[midIx];
    if (needle < mKey) {
      highIx = midIx;
    } else {
      lowIx = midIx + 1;
    }
  }
  return lowIx;
}

export default class SortedArray<T, C extends Comparable> {
  public readonly cmp: Comparator<T>;
  public readonly values: T[];
  private keys: C[];
  constructor(public readonly key: KeyFunc<T, C>, arr: readonly T[] = []) {
    this.cmp = mkComparator(key);
    this.values = arr.slice().sort(this.cmp);
    this.keys = this.values.map(key);
  }

  bisect_left(
    needle: C,
    lo: number = 0,
    hi: number = this.keys.length
  ): number {
    return bisect_left(this.keys, needle, lo, hi);
  }
  bisect_right(
    needle: C,
    lo: number = 0,
    hi: number = this.keys.length
  ): number {
    return bisect_right(this.keys, needle, lo, hi);
  }

  insert(t: T): void {
    const k = this.key(t);
    const index = this.bisect_right(k);
    this.values.splice(index, 0, t);
    this.keys.splice(index, 0, k);
  }

  rangeInclusive(start: C, firstPastEnd: C): [number, number] {
    const left = this.bisect_left(start);
    return [left, this.bisect_right(firstPastEnd, left)];
  }

  removeRange(startIndex: number, firstPastEndIndex: number): T[] {
    this.keys.splice(startIndex, firstPastEndIndex - startIndex);
    return this.values.splice(startIndex, firstPastEndIndex - startIndex);
  }

  contains(
    v: T,
    isEqual: (t1: T, t2: T) => boolean = (a, b) => a === b
  ): boolean {
    const ix = this.bisect_left(this.key(v));
    return ix < this.keys.length && isEqual(this.values[ix], v);
  }

  get array(): readonly T[] {
    return this.values;
  }

  get length(): number {
    return this.values.length;
  }

  [Symbol.iterator]() {
    return this.values[Symbol.iterator]();
  }
}

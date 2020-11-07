export type Comparable = string | number | Date;
export type KeySpec<T, C extends Comparable> = (arg0: T) => C;
export type Comparator<T> = (a: T, b: T) => -1 | 0 | 1;

function mkComparator<T, C extends Comparable>(ks: KeySpec<T, C>) {
  return function cmp(a: T, b: T): -1 | 0 | 1 {
    const ka = ks(a);
    const kb = ks(b);
    if (ka > kb) return 1;
    if (ka < kb) return -1;
    return 0;
  };
}

interface SearchResult {
  found: boolean;
  index: number;
}
interface RangeResult {
  startIndex: number;
  firstPastEndIndex: number;
}
export default class SortedArray<T, C extends Comparable = Comparable> {
  public readonly cmp: Comparator<T>;
  public readonly arr: T[];
  constructor(public readonly key: KeySpec<T, C>, arr: readonly T[] = []) {
    this.cmp = mkComparator(key);
    this.arr = arr.slice().sort(this.cmp);
  }

  bisect(needle: C): SearchResult {
    let lowIx = 0;
    let highIx = this.arr.length - 1;
    let midIx;

    while (lowIx <= highIx) {
      // The naive `low + high >>> 1` could fail for large arrays
      // because `>>>` converts its operands to int32 and (low + high) could
      // be larger than 2**31
      midIx = lowIx + ((highIx - lowIx) >>> 1);
      const mKey = this.key(this.arr[midIx]);
      if (mKey < needle) {
        lowIx = midIx + 1;
      } else if (mKey > needle) {
        highIx = midIx - 1;
      } else {
        return { found: true, index: midIx };
      }
    }
    return { found: false, index: lowIx };
  }

  insert(t: T): void {
    const { index } = this.bisect(this.key(t));
    this.arr.splice(index, 0, t);
  }

  range(start: C, end: C): RangeResult {
    const { index: startIndex, found } = this.bisect(start);
    let firstPastEndIndex = startIndex;
    if (!found) {
      return {
        startIndex,
        firstPastEndIndex,
      };
    }
    while (this.key(this.arr[firstPastEndIndex]) <= end) {
      firstPastEndIndex++;
    }
    return {
      startIndex,
      firstPastEndIndex,
    };
  }

  remove({ startIndex, firstPastEndIndex }: RangeResult): T[] {
    return this.arr.splice(startIndex, firstPastEndIndex - startIndex);
  }

  removeAll(k: C): T[] {
    return this.remove(this.range(k, k));
  }

  contains(k: C): boolean {
    const { found } = this.bisect(k);
    return found;
  }

  get array(): readonly T[] {
    return this.arr;
  }
  get length(): number {
    return this.arr.length;
  }
}

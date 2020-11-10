import * as fc from 'fast-check';
import { bisect_left, bisect_right } from '../src';

function cmpNum(a: number, b: number): number {
  return a - b;
}

describe('bisect_left', () => {
  it('identifies a position left of all larger or equal values', () =>
    fc.assert(
      fc.property(fc.array(fc.float()), fc.float(), (vals, pivot) => {
        vals.sort(cmpNum);
        const pivotIx = bisect_left(vals, pivot);
        if (pivotIx < vals.length) {
          expect(pivot).toBeLessThanOrEqual(vals[pivotIx]);
        }
        if (pivotIx > 0) {
          expect(vals[pivotIx - 1]).toBeLessThan(pivot);
        }
      })
    ));

  it('matches these examples I stole from the python tests', () => {
    expect(bisect_left([], 1)).toBe(0);
    expect(bisect_left([1], 0)).toBe(0);
    expect(bisect_left([1], 1)).toBe(0);
    expect(bisect_left([1], 2)).toBe(1);
    expect(bisect_left([1, 1], 0)).toBe(0);
    expect(bisect_left([1, 1], 1)).toBe(0);
    expect(bisect_left([1, 1], 2)).toBe(2);
    expect(bisect_left([1, 1, 1], 0)).toBe(0);
    expect(bisect_left([1, 1, 1], 1)).toBe(0);
    expect(bisect_left([1, 1, 1], 2)).toBe(3);
    expect(bisect_left([1, 1, 1, 1], 0)).toBe(0);
    expect(bisect_left([1, 1, 1, 1], 1)).toBe(0);
    expect(bisect_left([1, 1, 1, 1], 2)).toBe(4);
    expect(bisect_left([1, 2], 0)).toBe(0);
    expect(bisect_left([1, 2], 1)).toBe(0);
    expect(bisect_left([1, 2], 1.5)).toBe(1);
    expect(bisect_left([1, 2], 2)).toBe(1);
    expect(bisect_left([1, 2], 3)).toBe(2);
    expect(bisect_left([1, 1, 2, 2], 0)).toBe(0);
    expect(bisect_left([1, 1, 2, 2], 1)).toBe(0);
    expect(bisect_left([1, 1, 2, 2], 1.5)).toBe(2);
    expect(bisect_left([1, 1, 2, 2], 2)).toBe(2);
    expect(bisect_left([1, 1, 2, 2], 3)).toBe(4);
    expect(bisect_left([1, 2, 3], 0)).toBe(0);
    expect(bisect_left([1, 2, 3], 1)).toBe(0);
    expect(bisect_left([1, 2, 3], 1.5)).toBe(1);
    expect(bisect_left([1, 2, 3], 2)).toBe(1);
    expect(bisect_left([1, 2, 3], 2.5)).toBe(2);
    expect(bisect_left([1, 2, 3], 3)).toBe(2);
    expect(bisect_left([1, 2, 3], 4)).toBe(3);
    expect(bisect_left([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 0)).toBe(0);
    expect(bisect_left([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 1)).toBe(0);
    expect(bisect_left([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 1.5)).toBe(1);
    expect(bisect_left([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 2)).toBe(1);
    expect(bisect_left([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 2.5)).toBe(3);
    expect(bisect_left([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 3)).toBe(3);
    expect(bisect_left([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 3.5)).toBe(6);
    expect(bisect_left([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 4)).toBe(6);
    expect(bisect_left([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 5)).toBe(10);
  });
});

describe('bisect_right', () => {
  it('identifies a position right of all smaller or equal values', () =>
    fc.assert(
      fc.property(fc.array(fc.float()), fc.float(), (vals, pivot) => {
        vals.sort(cmpNum);
        const pivotIx = bisect_right(vals, pivot);
        if (pivotIx < vals.length) {
          expect(pivot).toBeLessThan(vals[pivotIx]);
        }
        if (pivotIx > 0) {
          expect(vals[pivotIx - 1]).toBeLessThanOrEqual(pivot);
        }
      })
    ));

  it('matches these examples I stole from the python tests', () => {
    expect(bisect_right([], 1)).toBe(0);
    expect(bisect_right([1], 0)).toBe(0);
    expect(bisect_right([1], 1)).toBe(1);
    expect(bisect_right([1], 2)).toBe(1);
    expect(bisect_right([1, 1], 0)).toBe(0);
    expect(bisect_right([1, 1], 1)).toBe(2);
    expect(bisect_right([1, 1], 2)).toBe(2);
    expect(bisect_right([1, 1, 1], 0)).toBe(0);
    expect(bisect_right([1, 1, 1], 1)).toBe(3);
    expect(bisect_right([1, 1, 1], 2)).toBe(3);
    expect(bisect_right([1, 1, 1, 1], 0)).toBe(0);
    expect(bisect_right([1, 1, 1, 1], 1)).toBe(4);
    expect(bisect_right([1, 1, 1, 1], 2)).toBe(4);
    expect(bisect_right([1, 2], 0)).toBe(0);
    expect(bisect_right([1, 2], 1)).toBe(1);
    expect(bisect_right([1, 2], 1)).toBe(1);
    expect(bisect_right([1, 2], 2)).toBe(2);
    expect(bisect_right([1, 2], 3)).toBe(2);
    expect(bisect_right([1, 1, 2, 2], 0)).toBe(0);
    expect(bisect_right([1, 1, 2, 2], 1)).toBe(2);
    expect(bisect_right([1, 1, 2, 2], 1)).toBe(2);
    expect(bisect_right([1, 1, 2, 2], 2)).toBe(4);
    expect(bisect_right([1, 1, 2, 2], 3)).toBe(4);
    expect(bisect_right([1, 2, 3], 0)).toBe(0);
    expect(bisect_right([1, 2, 3], 1)).toBe(1);
    expect(bisect_right([1, 2, 3], 1)).toBe(1);
    expect(bisect_right([1, 2, 3], 2)).toBe(2);
    expect(bisect_right([1, 2, 3], 2)).toBe(2);
    expect(bisect_right([1, 2, 3], 3)).toBe(3);
    expect(bisect_right([1, 2, 3], 4)).toBe(3);
    expect(bisect_right([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 0)).toBe(0);
    expect(bisect_right([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 1)).toBe(1);
    expect(bisect_right([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 1)).toBe(1);
    expect(bisect_right([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 2)).toBe(3);
    expect(bisect_right([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 2)).toBe(3);
    expect(bisect_right([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 3)).toBe(6);
    expect(bisect_right([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 3)).toBe(6);
    expect(bisect_right([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 4)).toBe(10);
    expect(bisect_right([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 5)).toBe(10);
  });
});

import * as crypto from 'crypto';

import { GObject } from './types';

export const toUnixTime = (timeString: string) => {
  let unixTime = Date.parse(timeString);
  if (unixTime === NaN) unixTime = Date.parse('1970-01-01');
  return unixTime;
};

export const intArr = (len: number) => {
  const res = [];
  for (let i = 0; i < len; i++) res.push(i);
  return res;
};

export const id = <T = any>(x: T) => x;
export const nop = (..._args: any) => {};
export const noTask = new Promise<void>(nop);
export const liftPromise = <T>(resolution: T) => new Promise<T>(r => r(resolution));
export const filterUndef = <T>(x: T | undefined): x is T => x !== undefined;

export const copyArrayObjects = <T>(a: T[]) => a.map(x => ({ ...x }));

export const getFromId = <T extends { id?: string }>(collection: T[], id: string) =>
  collection.find(b => b.id === id);

export function pipe(init: any) {
  return (...fns: Function[]) => fns.reduce((agg: any, f: Function) => f(agg), init);
}

export function compose<A, B, C>(fn1: (b: B) => C, fn2: (a: A) => B): (a: A) => C;
// eslint-disable-next-line
export function compose<A, B, C, D>(
  fn1: (c: C) => D,
  fn2: (b: B) => C,
  fn3: (a: A) => B,
): (a: A) => D;
export function compose(...fns: Function[]) {
  return (args: any[]) => fns.reduceRight((agg, f) => f(agg), args);
}

export const flatMap = <T = any, U = any>(arr: T[], fn: (arg: T) => U[] | U): U[] =>
  arr.reduce((agg, c) => {
    const next = fn(c);
    return Array.isArray(next) ? agg.concat([...next]) : agg.concat(next);
  }, [] as U[]);

export const concat = <T = any>(l: T[], r: T[]) => l.concat(r);

export const createLookup = <T extends { id?: string }>(sources: T[]): { [key: string]: T } =>
  sources.reduce(
    (idLookup, source) =>
      source.id
        ? {
            ...idLookup,
            [source.id]: source,
          }
        : idLookup,
    {},
  );

export const explode = (dotString: string, value: any) =>
  dotString
    .split('.')
    .reverse()
    .reduce((acc, cur) => ({ [cur]: acc }), value);

export const pick = <T extends GObject>(obj: T) => (...args: (keyof T)[]): Partial<T> =>
  Object.keys(obj).reduce(
    (strippedObj, key) => (args.includes(key) ? { ...strippedObj, [key]: obj[key] } : strippedObj),
    {} as Partial<T>,
  );

export const omit = <T extends GObject>(obj: T) => (...args: (keyof T)[]): Partial<T> =>
  Object.keys(obj).reduce(
    (strippedObj, key) => (!args.includes(key) ? { ...strippedObj, [key]: obj[key] } : strippedObj),
    {} as Partial<T>,
  );

export const revStr = (str: string) => str.split('').reduceRight((s, c) => s + c, '');
export const mapTrue = (_: any) => true;
export const mapFalse = (_: any) => false;

export const boolifyPromise = <R = any>(p: Promise<R>) => p.then(mapTrue).catch(mapFalse) ;

export const generateCode = () => {
  const seed = crypto.randomBytes(256);
  const code = crypto
    .createHash('sha1')
    .update(seed)
    .digest('hex');

  return code;
};

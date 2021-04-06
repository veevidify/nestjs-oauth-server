export type Nullable<T> = T | null;
export type GObject = Record<string, any>;
export type AnyFunc = (...args: any[]) => any;
export type Callback<T> = (err?: any, result?: T) => void;
export type Falsey = '' | 0 | false | null | undefined;

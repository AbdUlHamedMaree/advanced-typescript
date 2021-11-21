// ******************************
// MergeUnion
export type CommonKeys<T extends object> = keyof T;
export type AllKeys<T> = T extends any ? keyof T : never;
export type Subtract<A, C> = A extends C ? never : A;

export type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
  ? T[K]
  : never;

export type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
  ? PickType<T, K>
  : never;

export type MergeUnion<T extends object> = {
  [k in AllKeys<T>]: PickTypeOf<T, k>;
};

// ******************************
// Dictionary
export type Leaf =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
  | Function;

type ObjKey = string | number;

type Path<K extends ObjKey, V, IK extends ObjKey> = V extends Leaf
  ? { [Key in IK extends '' ? `${K}` : `${IK}.${K}`]: V }
  : ObjectPaths<V, IK extends '' ? `${K}` : `${IK}.${K}`>;

type ObjectPaths<T, IK = ''> = {
  [K in keyof T]: Path<K & string, T[K], IK & string>;
}[keyof T];

export type Dictionary<T> = MergeUnion<ObjectPaths<T, ''>>;

// ******************************
// MicroObject
export type MicroObject = {
  [key: string]: MicroObject | Leaf;
};

// ******************************
// deepCall
export const deepCall =
  <
    TObj extends MicroObject = MicroObject,
    TDec extends Dictionary<TObj> = Dictionary<TObj>,
  >(
    obj: TObj,
  ) =>
  <TKey extends keyof TDec>(key: TKey): TDec[TKey] => {
    throw new Error('not implemented');
    // or you can use
    // const val = key.split('.').reduce((acc, el) => acc?.[el], obj as any);
    // return typeof val === 'undefined' ? key : val;

    // or as an alternative you can use
    // return _.get(obj, key, key)
  };

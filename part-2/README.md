# Advanced TypeScript - Part 2

In this article I'll talk about some very important features in typescript

## Mapped Types

One of the big concepts in typescript which called **Mapped Types**,
Mapped Types describe the shape of object in more dynamic way.

---

### Example

```typescript
type FoodModel = {
  name: string;
  price: number;
  hot?: boolean;
};

type FoodMap = {
  [Key: string]: FoodModel;
};
// OR in better way
// type FoodMap = Record<string, FoodModel>;;

const foodMap: FoodMap = {
  pizza: {
    name: 'Hot Pizza!',
    price: 100,
    hot: true,
  },
  // anyString: {...},
};
```

you see..., in that example we can use and string as an key for an object.

you can go further then with union key type:

```typescript
type LaptopModel = {
  name: string;
  price: number;
  old?: boolean;
};

type LaptopMap = {
  [Key in 'asus' | 'hp']: LaptopModel;
};
// OR in better way
// type LaptopMap = Record<string, LaptopModel>;;

//       .---------> type script give an error that you should implement an 'hp' key too!.
const laptopMap: LaptopMap = {
  asus: {
    name: 'Hot Pizza!',
    price: 100,
    old: false,
  },
};
```

typescript will give you an error about not implementing `hp` key with its `LaptopModel`, but you don't want to implemented, so you can type:

```typescript
type LaptopModel = {
  name: string;
  price: number;
  old?: boolean;
};

type OldLaptopMap = {
  [Key in 'asus' | 'hp']: LaptopModel;
};

type NewLaptopMap = {
  [Key in 'asus' | 'hp']?: LaptopModel;
  //                    '------> MAGIC!, this let you say that `this keys could not be defined`
};

//       .------> NO ERRORS!
const laptopMap: NewLaptopMap = {
  asus: {
    name: 'Hot Pizza!',
    price: 100,
    old: false,
  },
};
```

now you can imagine how crazy stuff you can do with that!.

but wait until you see this concept.

---

## Lateral Type

Oh. in my opinion this is one of the most powerful concepts in typescript...

you ask why? just look at this:

```typescript
type Temp = 'Cold' | 'Hot';
type Drink = 'Tea' | 'Coffee';

type RestaurantMenu = `${Temp} ${Drink}`;
//        '------> type of 'Cold Tea' | 'Cold Coffee' | 'Hot Tea' | 'Hot Coffee'
// TOP CRAZY STUFF!
```

Is this possible in any other typed language?

**ABSOLUTELY NOT!**

this what's called _lateral type_, in this type you can build up an whole new type by mixing stuff and shape it as you want.

let's put this ALL together to build a real life application.

---

---

## Better Types for `_.get` Function

you know in [lodash.get](https://lodash.com/docs/4.17.15#get) you can access a property by its path as a string, but its doesn't help you if you miss with the key (in real that's fully true) but let's build together a better `get` and let's call our evaluated function `deepCall`.

### Goal

we want to have a function that give us the following functionality:

```typescript
const obj = {
  animals: {
    dog: {
      sound: 'WOFF!',
      maxAge: 12,
      canClimb: false,
      someFunc: (param: boolean) => `${param}`,
    },
    cat: {
      sound: 'MEOW!',
      maxAge: 8,
      canClimb: true,
      someFunc: (param: number) => (param > 0 ? '+' : '-'),
    },
  },
};

const get = deepCall(obj);

const catSound = get('animals.cat.sound');
//       '------> I want this to be of type `string`

const dogMaxAge = get('animals.dog.maxAge');
//        '------> I want this to be of type `number`

const func = get('animals.dog.someFunc');
//      '------> I want this to be of type `(param: boolean) => string`

const never = get('zxcvbn');
//                   '------> I want typescript to complain about this key!
```

I'll tell you that, this function is not impossible.

Let's start building it.

starting with the object that will be passed to the function.

```typescript
// the leaf node of our object.
export type Leaf =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
  | Function;

// the object we want to serve.
export type MicroObject = {
  [key: string]: MicroObject | Leaf;
};
```

- **Leaf:** is the type of the final node of each branch of our object.
- **MicroObject:** is the type of the object that we will pass to our function.

after we define the shape of our object, have a look at this type:

```typescript
// the object key type.
type ObjKey = string | number;

// this type will see if the generic value of the key that we reached is one of the `Leaf` types, it will stop and set `{ [resultedKey]: itsValue }` and if its not it will call `ObjectPaths` again with the second generic filled with the resulted key
type Path<K extends ObjKey, V, IK extends ObjKey> = V extends Leaf
  ? { [Key in IK extends '' ? `${K}` : `${IK}.${K}`]: V }
  : ObjectPaths<V, IK extends '' ? `${K}` : `${IK}.${K}`>;

// take an object and return a type union of it's keys and values: `{ [resultedKey]: valueType } | { [resultedKey2]: valueType2 }`
type ObjectPaths<T, IK = ''> = {
  [K in keyof T]: Path<K & string, T[K], IK & string>;
}[keyof T];
```

what you see is the mixin of what we learned in the previous and this lessons.

but we need to merge all this unions to generate a new object with the keys and its values.

so let's type:

```typescript
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
```

I found this beautiful type in [this article](https://dev.to/lucianbc/union-type-merging-in-typescript-9al)

what it does, that it join (merge) all the union types in one type

so we can type

```typescript
// one type that contains all the key and values we've got:
// `{
//   [key1]: value1,
//   [key2]: value2,
//   ...
// }`
export type Dictionary<T> = MergeUnion<ObjectPaths<T>>;
```

now it's time to put all this together in the function:

```typescript
export const deepCall =
  <
    // the type of the object passed
    TObj extends MicroObject = MicroObject,
    // the resulted dictionary of the object passed
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
```
AND THATS IT!

now you can use this helpful function anywhere like I do.

I use this function a lot as a small util with my big libraries.

***I Wish You Find That usefully***